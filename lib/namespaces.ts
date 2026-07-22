import { Namespace, SubjectSet, Context } from "@ory/keto-namespace-types"

class User implements Namespace {}

class Group implements Namespace {
  declare related: {
    members: User[]
  }
}

class Feature implements Namespace {
  declare related: {
    viewers: (User | SubjectSet<Group, "members">)[]
  }

  permits = {
    view: (ctx: Context): boolean => this.related.viewers.includes(ctx.subject),
  }
}
