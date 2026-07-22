export const namespaceRelations: Record<string, string[]> = {
	"User": [],
  "Group": ["members"],
	"Feature": ["viewers"],
};

export const namespaces = Object.keys(namespaceRelations);