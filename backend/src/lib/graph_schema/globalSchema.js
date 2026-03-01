export const GlobalTypeDef = `
  # Custom Scalars (Normal GraphQL mein Date nahi hota, ise define karna padta hai)
  scalar Date
  scalar JSON

  # Base Types (Root)
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  # Global Response Format (Har mutation ke liye kaam aayega)
  type MutationResponse {
    success: Boolean!
    message: String
    code: String
  }
`;