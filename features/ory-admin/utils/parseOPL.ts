import fs from "node:fs"
import { Node, Project, TypeNode } from "ts-morph"

export interface RelationTarget {
  namespace: string
  relation?: string
}

export interface RelationInfo {
  name: string
  types: RelationTarget[]
}

export interface NamespaceInfo {
  name: string
  relations: RelationInfo[]
}

/**
 * Парсит OPL-файл (namespaces.ts) в список namespace'ов и их relations.
 * Принимает путь на диске — например, файл, смонтированный в контейнер
 * через volume/ConfigMap в рантайме.
 */
export function parseOPL(filePath: string): NamespaceInfo[] {
  const source = fs.readFileSync(filePath, "utf-8")

  const project = new Project({ useInMemoryFileSystem: true })
  const sourceFile = project.createSourceFile("namespaces.ts", source)

  const namespaceClasses = sourceFile
    .getClasses()
    .filter((cls) =>
      cls
        .getImplements()
        .some((impl) => impl.getExpression().getText() === "Namespace"),
    )

  return namespaceClasses.map((cls) => {
    const name = cls.getNameOrThrow()
    const relatedProp = cls.getProperty("related")
    const relations: RelationInfo[] = []

    const typeNode = relatedProp?.getTypeNode()
    if (typeNode && Node.isTypeLiteral(typeNode)) {
      for (const member of typeNode.getProperties()) {
        const memberTypeNode = member.getTypeNode()
        relations.push({
          name: member.getName(),
          types: memberTypeNode ? resolveRelationTargets(memberTypeNode) : [],
        })
      }
    }

    return { name, relations }
  })
}

function resolveRelationTargets(typeNode: TypeNode): RelationTarget[] {
  // User[]
  if (Node.isArrayTypeNode(typeNode)) {
    return resolveRelationTargets(typeNode.getElementTypeNode())
  }

  // Array<User>
  if (
    Node.isTypeReference(typeNode) &&
    typeNode.getTypeName().getText() === "Array"
  ) {
    const [arg] = typeNode.getTypeArguments()
    return arg ? resolveRelationTargets(arg) : []
  }

  // (A | B)
  if (Node.isParenthesizedTypeNode(typeNode)) {
    return resolveRelationTargets(typeNode.getTypeNode())
  }

  // A | B
  if (Node.isUnionTypeNode(typeNode)) {
    return typeNode.getTypeNodes().flatMap(resolveRelationTargets)
  }

  // SubjectSet<Group, "members">
  if (
    Node.isTypeReference(typeNode) &&
    typeNode.getTypeName().getText() === "SubjectSet"
  ) {
    const [nsArg, relArg] = typeNode.getTypeArguments()
    return [
      {
        namespace: nsArg?.getText() ?? "unknown",
        relation: relArg?.getText().replace(/^['"]|['"]$/g, ""),
      },
    ]
  }

  // Прямая ссылка на другой namespace-класс, например `User`
  if (Node.isTypeReference(typeNode)) {
    return [{ namespace: typeNode.getTypeName().getText() }]
  }

  return []
}
