// rff-demo gql_typeDefs.js
// provides typedefs for apollo server in express

const { gql } = require('apollo-server-express');

// type defining for various data type used by application

const typeDefs = gql`
  type Ingredient {
    type: String!
    name: String!
    uses: [String!]!
    addedBy: User!
    id: ID!
  }
  type Comment {
    comment: String!
    karma: Int!
    addedBy: User!
    listID: String!
    id: ID!
  }
  type CookingMethod {
    name: String!
    uses: [String!]!
    addedBy: User!
    id: ID!
  }
  type Dish {
    name: String!
    cookingMethods: [CookingMethod!]!
    proteins: [Ingredient!]!
    carbs: [Ingredient!]!
    spices: [Ingredient!]!
    karma: Int!
    note: String!
    addedBy: User!
    id: ID!
  }
  type Group {
    title: String!
    active: Boolean!
    removable: Boolean!
    creator: User!
    id: ID!
  }
  type GroupList {
    title: String!
    listType: String!
    removable: Boolean!
    group: Group!
    id: ID!
  }
  type PrivateList {
    title: String!
    listType: String!
    removable: Boolean!
    owner: User!
    id: ID!
  }
  type Task {
    task: String!
    active: Boolean!
    priority: Boolean!
    creator: User!
    listID: String!
    id: ID!
    }
  type Token {
    value: String!
  }
  type User {
    username: String!
    passwordHash: String!
    active: Boolean!
    removable: Boolean!
    role: String!
    groups: [Group!]!
    id: ID!
    stops: [String!]!
  }
  type News {
    content: String!
    category: String!
    author: User!
    id: ID!
  }
  type Query {
    me(token: String!): User!
    userCount(token: String!): Int!
    users(token: String!, active: Boolean, username: String, role: String, group: String): [User!]!
    groupCount(token: String!, mode: String): Int!
    groups(token: String!): [Group!]!
    allGroups(token: String!): [Group!]!
    listCount(token: String): Int!
    allListCount(token: String!): Int!
    privateLists(token: String!): [PrivateList!]!
    groupLists(token: String!): [GroupList!]!
    taskCount(token: String!, countType: String!): Int!
    allTaskCount(token: String!): Int!
    tasks(token: String!, listID: String!): [Task!]!
    carbCount: Int!
    allCarbs: [Ingredient!]!
    dishCount: Int!
    allDishes: [Dish!]!
    methodCount: Int!
    allMethods: [CookingMethod!]!
    proteinCount: Int!
    allProteins: [Ingredient!]!
    spiceCount: Int!
    allSpices: [Ingredient!]!
    dishes(carb: String, method: String, protein: String, spice: String): [Dish!]!
    comments(token: String!, id: String!): [Comment!]!
    news: [News!]!
    categoryNews(category: String!): [News!]!
  }
  type Mutation {
    addNews(token: String!, category: String!, content: String!): News!,
    editNews(token: String!, id: String!, content: String!, category: String!): News!,
    removeNews(token: String!, id: String!): News!,
    addIngredient(token: String!, type: String!, name: String!): Ingredient!,
    removeIngredient(token: String!, id: String!): Ingredient!,
    addDish(token: String!, name: String!, cookingMethods: [String!]!, carbs: [String!]!,
      proteins: [String!]!, spices: [String!]!, note: String!): Dish!,
    updateDish(token: String!, id: String!, name: String, carbs: [String], methods: [String],
      proteins: [String], spices: [String], karma: Int, note: String): Dish!,
    removeDish(token: String!, id: String!): Dish!,
    dishKarma(token: String!, id: String!, vote: String!): Dish!,
    addMethod(token: String!, name: String!): CookingMethod!,
    removeMethod(token: String!, id: String!): CookingMethod!,
    addListGroup(token: String!, title: String!, group: String!): GroupList!,
    removeListGroup(token: String!, id: String!): GroupList!,
    addListPrivate(token: String!, title: String!): PrivateList!,
    removeListPrivate(token: String!, id: String!): PrivateList!,
    addComment(token: String!, listID: String!, comment: String!): Comment!,
    removeComment(token: String!, id: String!): Comment!,
    voteComment(token: String!, id: String!, vote: String!): Comment!,
    addTask(token: String!, task: String!, listID: String!, priority: Boolean!): Task!,
    removeTask(token: String!, id: String!): Task!,
    taskPriority(token: String!, id: String!, priority: Boolean!): Task!,
    taskActivation(token: String!, id: String!): Task!,
    taskDeactivation(token: String!, id: String!): Task!,
    addUser(username: String!, password: String!): User!,
    updateUser(token: String!, password: String!,
      newUsername: String, newPassword: String): User!,
    promoteUser(token: String!, id: String!): User!,
    demoteUser(token: String!, id: String!): User!,
    removeUser(token: String!, id: String!, password: String): User!,
    activateUser(token: String!, id: String!): User!,
    deactivateUser(token: String!, id: String!): User!,
    addStop(token: String!, stop: String!): User!,
    removeStop(token: String!, stop: String!): User!,
    addGroup(token: String!, title: String!): Group!,
    updateGroup(token: String!, id: String!, title: String, active: Boolean): Group!,
    activateGroup(token: String!, id: String!): Group!,
    deactivateGroup(token: String!, id: String!): Group!,
    removeGroup(token: String!, id: String!): Group!,
    login(username: String!, password: String!): Token!
  }
  type Subscription {
    newsAdded: News!
    newsUpdated: News!
    newsRemoved: News!
    ingredientAdded: Ingredient!
    ingredientUpdated: Ingredient!
    ingredientRemoved: Ingredient!
    dishAdded: Dish!
    dishVoted: Dish!
    dishUpdated: Dish!
    dishRemoved: Dish!
    methodAdded: CookingMethod!
    methodUpdated: CookingMethod!
    methodRemoved: CookingMethod!
    listAddedGroup: GroupList!
    listRemovedGroup: GroupList!
    listAddedPrivate: PrivateList!
    listRemovedPrivate: PrivateList!
    taskAdded: Task!
    taskUpdated: Task!
    taskRemoved: Task!
    userAdded: User!
    userUpdated: User!
    userRemoved: User!
    groupAdded: Group!
    groupUpdated: Group!
    groupRemoved: Group!
    majorDBE: Boolean!
  }
`;

module.exports = { typeDefs };
