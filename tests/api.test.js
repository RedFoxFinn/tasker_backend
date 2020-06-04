// rff-demo api.test.js
// project backend api tests

// imports
const config = require('../utils/config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const gql = require('graphql-tag');
const EasyGraphQLTester = require('easygraphql-tester');
const dbPusher = require('../utils/dbInit');

const { typeDefs } = require('../graphql/gql_typeDefs');
const { resolvers } = require('../graphql/gql_resolvers');

const tester = new EasyGraphQLTester(typeDefs, resolvers);

const { Ingredient, CookingMethod, Comment, Dish, Group,
  GroupList, PrivateList, Task, User, News } = require('../models/modelImporter');

// sample data for testing
const samples = {
  stops: ['3483','3482','3476','3477','3478'],
  dummyUser: {
    username: 'dummy',
    password: 'dummy'
  },
  nullUser: {
    username: 'nullUser',
    password: 'nullPW',
    wrongPassword: 'nullify',
    active: false,
    removable: false,
    role: 'admin',
    groups: []
  },
  user1: {
    username: 'testUser1',
    password: 'testing1',
    wrongPassword: 'notTesting1',
    active: true,
    removable: true,
    role: 'admin',
    groups: []
  },
  user2: {
    username: 'testUser2',
    password: 'testing2',
    wrongPassword: 'notTesting2',
    active: true,
    removable: true,
    role: 'user',
    groups: []
  },
  group1: {
    title: 'testGroup1',
    active: true,
    removable: true,
    creator: 'toBeDestined'
  },
  group2: {
    title: 'testGroup2',
    active: true,
    removable: true,
    creator: 'toBeDestined'
  },
  privateList1: {
    owner: 'toBeDestined',
    title: 'privateTestList1',
    removable: true
  },
  privateList2: {
    owner: 'toBeDestined',
    title: 'privateTestList2',
    removable: true
  },
  genericCommentP: 'comment:private:list',
  groupList1: {
    group: 'toBeDestined',
    title: 'groupTestList1',
    removable: true
  },
  groupList2: {
    group: 'toBeDestined',
    title: 'groupTestList2',
    removable: true
  },
  groupList3: {
    group: 'toBeDestined',
    title: 'groupTestList3',
    removable: true
  },
  genericCommentG: 'comment:group:list',
  genericTaskP: {
    task: 'task:generic:private:list',
    priority: true,
    listID: 'toBeDestined'
  },
  genericTaskG: {
    task: 'task:generic:group:list',
    priority: true,
    listID: 'toBeDestined'
  },
  spices: [
    { type: 'spice', name: 'salt', uses: [] },
    { type: 'spice', name: 'pepper', uses: [] },
    { type: 'spice', name: 'chili', uses: [] },
    { type: 'spice', name: 'soy sauce', uses: [] },
    { type: 'spice', name: 'cumin', uses: [] },
    { type: 'spice', name: 'bay leaf', uses: [] }
  ],
  proteins: [
    { type: 'protein', name: 'ground beef', uses: [] },
    { type: 'protein', name: 'silken tofu', uses: [] },
    { type: 'protein', name: 'green beans', uses: [] },
    { type: 'protein', name: 'salmon', uses: [] },
    { type: 'protein', name: 'chicken', uses: [] },
  ],
  methods: [
    { name: 'steaming', uses: [] },
    { name: 'pan frying', uses: [] },
    { name: 'poaching', uses: [] },
    { name: 'grilling', uses: [] },
    { name: 'boiling', uses: [] },
    { name: 'pickling', uses: [] },
  ],
  carbs: [
    { type: 'carb', name: 'jasmin rice', uses: [] },
    { type: 'carb', name: 'sushi rice', uses: [] },
    { type: 'carb', name: 'basmati rice', uses: [] },
    { type: 'carb', name: 'rice pasta', uses: [] },
    { type: 'carb', name: 'bean pasta', uses: [] },
    { type: 'carb', name: 'corn pasta', uses: [] },
    { type: 'carb', name: 'mashed potatoes', uses: [] },
    { type: 'carb', name: 'fried potatoes', uses: [] },
    { type: 'carb', name: 'boiled potatoes', uses: [] },
    { type: 'carb', name: 'french fries', uses: [] }
  ],
  dish1: {
    name: 'testDish1',
    cookingMethods: [],
    proteins: [],
    carbs: [],
    spices: [],
    note: 'toBeDestined'
  },
  dish2: {
    name: 'testDish1',
    cookingMethods: [],
    proteins: [],
    carbs: [],
    spices: [],
    note: 'toBeDestined'
  },
  dishNote1: 'This dish isn\'t very good',
  dishNote2: 'This dish is delicious',
  news: [
    {
      content: 'This is a test',
      category: 'test'
    },{
      content: 'This is a test too',
      category: 'test'
    }
  ],
  devNews: [
    {
      content: 'Tasker is now in testing phase',
      category: 'milestone'
    },{
      content: 'Dishy is now in testing phase',
      category: 'milestone'
    },{
      content: 'News is now in testing phase',
      category: 'milestone'
    },{
      content: 'Additional translations for Finnish will be delayed',
      category: 'feature'
    },{
      content: 'Transporter will be delayed',
      category: 'feature'
    }
  ],
  defaultGroup: {
    title: 'testGroup'
  }
};

// list test helpers
// private
const privateListInit = async (token) => {
  await tester.graphql(
    await createMutation('addListPrivate'),
    undefined, undefined,
    {
      token: token,
      title: samples.privateList1.title
    }
  );
  return PrivateList.findOne({ title: samples.privateList1.title }).populate('owner');
};
// group
const groupListInit = async (token, group) => {
  await tester.graphql(
    await createMutation('addListGroup'),
    undefined, undefined,
    {
      title: samples.groupList1.title,
      token: token,
      group: group
    }
  );
  return GroupList.findOne({ title: samples.groupList1.title }).populate('group');
};

// username reverse, test helper function
const usernameReverse = (username) => {
  const splitUsername = username.split('');
  const reverseUsername = splitUsername.reverse();
  return reverseUsername.join('');
};

// user creation - password hashing
const hash = (password) => {
  return bcrypt.hash(password, 10);
};

// tests - dummyUser
const setDummyUser = async () => {
  await new User({
    username: samples.dummyUser.username,
    passwordHash: await hash(samples.dummyUser.password),
    removable: true,
    active: true,
    groups: [],
    role: 'user'
  }).save();
};

const getDummyToken = async () => {
  const payload = {
    username: samples.dummyUser.username,
    password: samples.dummyUser.password
  };

  const mutation = await createMutation('login');
  const { data } = await tester.graphql(mutation, undefined, undefined, payload);
  return data.login.value;
};
// tests - nullUser
const getNullToken = async () => {
  const payload = {
    username: samples.nullUser.username,
    password: samples.nullUser.password
  };

  const mutation = await createMutation('login');
  const { data } = await tester.graphql(mutation, undefined, undefined, payload);
  return data.login.value;
};

// reset mongo:test
const resetDB = async () => {
  await resetIngredients();
  await resetComments();
  await resetMethods();
  await resetDishes();
  await resetGroups();
  await resetListsGroup();
  await resetListsPrivate();
  await resetNews();
  await resetTasks();
  await resetUsers();
  await setNullUser();
  await setDummyUser();
  const nullUser = await User.findOne({username: samples.nullUser.username});
  await setDevNews(nullUser._id.toString());
};

// helper functions for resetting
const resetIngredients = async () => await Ingredient.deleteMany({});
const resetComments = async () => await Comment.deleteMany({});
const resetMethods = async () => await CookingMethod.deleteMany({});
const resetDishes = async () => await Dish.deleteMany({});
const resetGroups = async () => await Group.deleteMany({});
const resetListsGroup = async () => await GroupList.deleteMany({});
const resetListsPrivate = async () => await PrivateList.deleteMany({});
const resetTasks = async () => await Task.deleteMany({});
const resetUsers = async () => await User.deleteMany({});
const resetNews = async () => await News.deleteMany({});
const setNullUser = async () => {
  try {
    await new User({
      username: samples.nullUser.username,
      passwordHash: await hash(samples.nullUser.password),
      active: false,
      removable: false,
      role: 'owner',
      groups: []
    }).save();
  } catch (e) {
    console.error(e);
  }
};
const setDevNews = (userID) => {
  samples.devNews.forEach(async dn => {
    await new News({
      content: dn.content,
      category: dn.category,
      author: userID
    }).save();
  });
};
const setIngredients = async (userID) => {
  let result = 0;
  console.error('setting up ingredients . . .');
  result += await setMethods(userID);
  result += await setProteins(userID);
  result += await setSpices(userID);
  result += await setCarbs(userID);
  result === 4 ? console.log('done') : console.error('err');
};
const setCarbs = async (userID) => {
  return await dbPusher('carb', samples.carbs, userID) ? 1 : 0;
};
const setMethods = async (userID) => {
  return await dbPusher('method', samples.methods, userID) ? 1 : 0;
};
const setProteins = async (userID) => {
  return await dbPusher('protein', samples.proteins, userID) ? 1 : 0;
};
const setSpices = async (userID) => {
  return await dbPusher('spice', samples.spices, userID) ? 1 : 0;
};

// helpers functions creating queries & mutations
const createQuery = (queryType) => {
  switch (queryType) {
  case 'news':
    return gql`
      query news {
        news {
          content
          category
          id
        }
      }
    `;
  case 'categoryNews':
    return gql`
      query categoryNews($category: String!) {
        categoryNews(category: $category) {
          content
          category
          id
        }
      }
    `;
  case 'userCount':
    return gql`
      query userCount($token: String!) {
        userCount(token: $token)
      }
    `;
  case 'users':
    return gql`
      query users($token: String!, $active: Boolean, $username: String, $role: String, $group: String) {
        users(token: $token, active: $active, username: $username, role: $role, group: $group) {
          username
          role
          active
          id
        }
      }
    `;
  case 'groupCount':
    return gql`
      query groupCount($token: String!) {
        groupCount(token: $token)
      }
    `;
  case 'groups':
    return gql`
      query groups($token: String!) {
        groups(token: $token) {
          title
          active
          id
        }
      }
    `;
  case 'allGroups':
    return gql`
      query allGroups($token: String!) {
        allGroups(token: $token) {
          title
          active
          id
        }
      }
    `;
  case 'allListCount':
    return gql`
      query allListCount($token: String!) {
        allListCount(token: $token)
      }
    `;
  case 'allTaskCount':
    return gql`
      query allTaskCount($token: String!) {
        allTaskCount(token: $token)
      }
    `;
  case 'carbCount':
    return gql`
      query {
        carbCount
      }
    `;
  case 'allCarbs':
    return gql`
      query {
        allCarbs {
          type
          name
          id
          addedBy {
            username
          }
        }
      }
    `;
  case 'dishCount':
    return gql`
      query {
        dishCount
      }
    `;
  case 'allDishes':
    return gql`
      query {
        allDishes {
          name
          karma
          id
          addedBy {
            username
          }
        }
      }
    `;
  case 'methodCount':
    return gql`
      query {
        methodCount
      }
    `;
  case 'allMethods':
    return gql`
      query {
        allMethods {
          name
          id
          addedBy {
            username
          }
        }
      }
    `;
  case 'proteinCount':
    return gql`
      query {
        proteinCount
      }
    `;
  case 'allProteins':
    return gql`
      query {
        allProteins {
          type
          name
          id
          addedBy {
            username
          }
        }
      }
    `;
  case 'spiceCount':
    return gql`
      query {
        spiceCount
      }
    `;
  case 'allSpices':
    return gql`
      query {
        allSpices {
          type
          name
          id
          addedBy {
            username
          }
        }
      }
    `;
  case 'listCount':         // args: userID, groupID
    return gql`
      query listCount($token: String, $groupID: String) {
        listCount(token: $token, groupID: $groupID)
      }
    `;
  case 'privateLists':      // args: userID!
    return gql`
      query privateLists($token: String!) {
        privateLists(token: $token) {
          title
          listType
          id
          owner {
            username
          }
        }
      }
    `;
  case 'groupLists':        // args: groupID!
    return gql`
      query groupLists($token: String!) {
        groupLists(token: $token) {
          title
          listType
          id
          group {
            title
          }
        }
      }
    `;
  case 'taskCount':         // args: listID
    return gql`
      query taskCount($token: String!, $countType: String!) {
        taskCount(token: $token, countType: $countType)
      }
    `;
  case 'tasks':             // args: listID
    return gql`
      query tasks($token: String!, $listID: String!) {
        tasks(token: $token, listID: $listID) {
          task
          active
          priority
          creator {
            username
          }
          listID
          id
        }
      }
    `;
  case 'dishes':            // args: carb, method, protein, spice
    return gql`
      query dishes($carb: String, $method: String, $protein: String, $spice: String) {
        dishes(carb: $carb, method: $method, protein: $protein, spice: $spice) {
          name
          cookingMethods {
            name
          }
          carbs {
            name
          }
          proteins {
            name
          }
          spices {
            name
          }
          karma
          note
          addedBy {
            username
          }
          id
        }
      }
    `;
  case 'comments':          // args: id!
    return gql`
      query comments($token: String!, $id: String!) {
        comments(id: $id, token: $token) {
          comment
          karma
          listID
          addedBy {
            username
          }
        }
      }
    `;
  default:
    return gql`
      query userCount($token: String!) {
        userCount(token: $token)
      }
    `;
  }
};

const createMutation = (mutationType) => {
  switch (mutationType) {
  case 'addNews':
    return gql`
      mutation addNews($token: String!, $content: String!, $category: String!) {
        addNews(token: $token, content: $content, category: $category) {
          content
          category
          id
        }
      }
    `;
  case 'editNews':
    return gql`
      mutation editNews($token: String!, $id: String!, $content: String!, $category: String!) {
        editNews(token: $token, id: $id, content: $content, category: $category) {
          content
          category
          id
        }
      }
    `;
  case 'removeNews':
    return gql`
      mutation removeNews($token: String!, $id: String!) {
        removeNews(token: $token, id: $id) {
          content
          category
          id
        }
      }
    `;
  case 'login':
    return gql`
      mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          value
        }
      }
    `;
  case 'addDish':           // args: name!, carbs!, methods!, proteins!, spices!, note
    return gql`
      mutation addDish($token: String!, $name: String!, $cookingMethods: [String!]!, $carbs: [String!]!,
        $proteins: [String!]!, $spices: [String!]!, $note: String!) {
          addDish(token: $token, name: $name, cookingMethods: $cookingMethods, carbs: $carbs, proteins: $proteins,
            spices: $spices, note: $note) {
              name
              id
              addedBy {
                username
              }
              cookingMethods {
                name
              }
              carbs {
                name
              }
              proteins {
                name
              }
              spices {
                name
              }
              karma
              note
            }
      }
    `;
  case 'updateDish':        // args: id!, name, carbs, methods, proteins, spices, karma
    return gql`
      mutation updateDish($token: String!, $id: String!, $name: String, $methods: [String!], $carbs: [String!],
        $proteins: [String!], $spices: [String!], $karma: Int, $note: String) {
          updateDish(token: $token, id: $id, name: $name, methods: $methods, carbs: $carbs, proteins: $proteins,
            spices: $spices, karma: $karma, note: $note) {
            name
            id
            addedBy {
              username
            }
            cookingMethods {
              name
            }
            carbs {
              name
            }
            proteins {
              name
            }
            spices {
              name
            }
            karma
            note
          }
      }
    `;
  case 'removeDish':        // args: id!
    return gql`
      mutation removeDish($token: String!, $id: String!) {
        removeDish(token: $token, id: $id) {
          name
          id
        }
      }
    `;
  case 'dishKarma':         // args: id!, vote!
    return gql`
      mutation dishKarma($token: String!, $id: String!, $vote: String!) {
        dishKarma(token: $token, id: $id, vote: $vote) {
          name
          id
          karma
        }
      }
    `;
  case 'addIngredient':           // args: type!, name!
    return gql`
      mutation addIngredient($token: String!, $type: String!, $name: String!) {
        addIngredient(token: $token, name: $name, type: $type) {
          name
          type
          id
        }
      }
    `;
  case 'removeIngredient':        // args: id!
    return gql`
      mutation removeIngredient($token: String!, $id: String!) {
        removeIngredient(token: $token, id: $id) {
          name
          type
          id
        }
      }
    `;
  case 'addMethod':         // args: type!, name!
    return gql`
      mutation addMethod($token: String!, $name: String!) {
        addMethod(token: $token, name: $name) {
          name
          id
        }
      }
    `;
  case 'removeMethod':      // args: id!
    return gql`
      mutation removeMethod($token: String!, $id: String!) {
        removeMethod(token: $token, id: $id) {
          name
          id
        }
      }
    `;
  case 'addListGroup':      // args: title!, group!
    return gql`
      mutation addListGroup($token: String!, $title: String!, $group: String!) {
        addListGroup(token: $token, title: $title, group: $group) {
          title
          listType
          group {
            title
          }
          id
        }
      }
    `;
  case 'removeListGroup':   // args: id!
    return gql`
      mutation removeListGroup($token: String!, $id: String!) {
        removeListGroup(token: $token, id: $id) {
          title
          id
        }
      }
    `;
  case 'addListPrivate':    // args: title!
    return gql`
      mutation addListPrivate($token: String!, $title: String!) {
        addListPrivate(token: $token, title: $title) {
          title
          listType
          owner {
            username
          }
          id
        }
      }
    `;
  case 'removeListPrivate': // args: id!
    return gql`
      mutation removeListPrivate($token: String!, $id: String!) {
        removeListPrivate(token: $token, id: $id) {
          title
          id
        }
      }
    `;
  case 'addComment':        // args: listID!, comment!
    return gql`
      mutation addComment($token: String!, $listID: String!, $comment: String!) {
        addComment(token: $token, listID: $listID, comment: $comment) {
          comment
          id
          karma
          listID
          addedBy {
            username
          }
        }
      }
    `;
  case 'removeComment':     // args: id!
    return gql`
      mutation removeComment($token: String!, $id: String!) {
        removeComment(token: $token, id: $id) {
          comment
          id
        }
      }
    `;
  case 'voteComment':       // args: id!, vote!
    return gql`
      mutation voteComment($token: String!, $id: String!, $vote: String!) {
        voteComment(token: $token, id: $id, vote: $vote) {
          comment
          id
          karma
        }
      }
    `;
  case 'addTask':           // args: task!, listID!, priority!
    return gql`
      mutation addTask($token: String!, $task: String!, $listID: String!, $priority: Boolean!) {
        addTask(token: $token, listID: $listID, task: $task, priority: $priority) {
          task
          listID
          id
          priority
          active
          creator {
            username
          }
        }
      }
    `;
  case 'removeTask':        // args: id!
    return gql`
      mutation removeTask($token: String!, $id: String!) {
        removeTask(token: $token, id: $id) {
          task
          listID
          id
          priority
          active
          creator {
            username
          }
        }
      }
    `;
  case 'taskPriority':      // args: id!, priority!
    return gql`
      mutation taskPriority($token: String!, $id: String!, $priority: Boolean!) {
        taskPriority(token: $token, id: $id, priority: $priority) {
          task
          listID
          id
          priority
          active
          creator {
            username
          }
        }
      }
    `;
  case 'taskActivation':
    return gql`
      mutation taskActivation($token: String!, $id: String!) {
        taskActivation(token: $token, id: $id) {
          task
          listID
          id
          priority
          active
          creator {
            username
          }
        }
      }
    `;
  case 'taskDeactivation':
    return gql`
      mutation taskDeactivation($token: String!, $id: String!) {
        taskDeactivation(token: $token, id: $id) {
          task
          listID
          id
          priority
          active
          creator {
            username
          }
        }
      }
    `;
  case 'addUser':           // args: username!, password!
    return gql`
      mutation addUser($username: String!, $password: String!) {
        addUser(username: $username, password: $password) {
          username
          id
          active
          removable
          role
        }
      }
    `;
  case 'updateUser':        // token!, password!, newUsername, newPassword
    return gql`
      mutation updateUser($token: String!, $password: String!,
        $newUsername: String, $newPassword: String) {
          updateUser(token: $token, password: $password, newUsername: $newUsername,
            newPassword: $newPassword) {
              username
              id
              active
              removable
              role
          }
      }
    `;
  case 'demoteUser':
    return gql`
      mutation demoteUser($token: String!, $id: String!) {
        demoteUser(token: $token, id: $id) {
          username
          id
          active
          role
          removable
        }
      }
    `;
  case 'promoteUser':
    return gql`
      mutation promoteUser($token: String!, $id: String!) {
        promoteUser(token: $token, id: $id) {
          username
          id
          active
          role
          removable
        }
      }
    `;
  case 'removeUser':        // args: id!, password
    return gql`
      mutation removeUser($token: String!, $id: String!, $password: String) {
        removeUser(token: $token, id: $id, password: $password) {
          username
          id
          active
          removable
          role
        }
      }
    `;
  case 'activateUser':
    return gql`
      mutation activateUser($token: String!, $id: String!) {
        activateUser(token: $token, id: $id) {
          username
          id
          active
          removable
          role
        }
      }
    `;
  case 'deactivateUser':
    return gql`
      mutation deactivateUser($token: String!, $id: String!) {
        deactivateUser(token: $token, id: $id) {
          username
          id
          active
          removable
          role
        }
      }
    `;
  case 'addStop':
    return gql`
      mutation addStop($token: String!, $stop: String!) {
        addStop(token: $token, stop: $stop) {
          username
          stops
        }
      }
    `;
  case 'removeStop':
    return gql`
      mutation removeStop($token: String!, $stop: String!) {
        removeStop(token: $token, stop: $stop) {
          username
          stops
        }
      }
    `;
  case 'addGroup':          // args: title!
    return gql`
      mutation addGroup($token: String!, $title: String!) {
        addGroup(token: $token, title: $title) {
          title
          id
          creator {
            username
          }
        }
      }
    `;
  case 'updateGroup':       // args: id!, title, active
    return gql`
      mutation updateGroup($token: String!, $id: String!, $title: String, $active: Boolean) {
        updateGroup(token: $token, id: $id, title: $title, active: $active) {
          title
          id
          active
        }
      }
    `;
  case 'activateGroup':
    return gql`
      mutation activateGroup($token: String!, $id: String!) {
        activateGroup(token: $token, id: $id) {
          title
          id
          active
          removable
          creator {
            username
            id
          }
        }
      }
    `;
  case 'deactivateGroup':
    return gql`
      mutation deactivateGroup($token: String!, $id: String!) {
        deactivateGroup(token: $token, id: $id) {
          title
          id
          active
          removable
          creator {
            username
            id
          }
        }
      }
    `;
  case 'removeGroup':       // args: id!
    return gql`
      mutation removeGroup($token: String!, $id: String!) {
        removeGroup(token: $token, id: $id) {
          title
          id
        }
      }
    `;
  default:                  // by default: login
    return gql`
      mutation addUser($username: String!, $password: String!) {
        addUser(username: $username, password: $password) {
          username
          id
          active
          removable
          role
        }
      }
    `;
  }
};

let connection;

// setup db for testing
beforeAll(async () => {

  // mongoose options
  mongoose.set('useFindAndModify', false);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);

  try {
    connection = await mongoose.connect(config.mongo);
    console.log('Connection to Atlas - MongoDB cloud: success');
  } catch (e) {
    console.error('Connection to Atlas - MongoDB cloud: failed');
  } finally {
    console.error('resetting testing database . . .');
    await resetDB();
    console.log('done');
  }
});

afterAll(async () => {
  await connection.close;
});

// test sets

// dummy
describe('test:dummy', () => {
  test('dummy, success', () => {
    const x = process.env.NODE_ENV === 'testing' ? 'dummy' : 'notDummy';
    expect(x).toBe('dummy');
    console.log('dummy - success: done');
  });
  test('dummy, fail', () => {
    const x = process.env.NODE_ENV === 'development' ? 'dummy' : 'notDummy';
    expect(x).toBe('notDummy');
    console.log('dummy - fail: done');
  });
});

// user test
describe('API:test:user', () => {
  let nullUser;
  let user;
  let usernameReversed;
  let masterToken;
  let token;

  beforeAll(async () => {
    nullUser = await User.findOne({ username: samples.nullUser.username });
  });

  test('login:gql, fail', async () => {
    const mutation = await createMutation('login');
    const variables = {
      username: samples.nullUser.username,
      password: samples.nullUser.wrongPassword
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Invalid credentials!');
    console.log('login - gql - fail: done');
  });

  test('login:gql, success', async () => {
    const mutation = await createMutation('login');
    const variables = {
      username: samples.nullUser.username,
      password: samples.nullUser.password
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.login).toBeDefined();
    masterToken = data.login.value;
    console.log('login - gql - success: done');
  });

  test('userCount', async () => {
    const query = await createQuery('userCount');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.userCount).toBeDefined();
    expect(data.userCount).toBe(2);
    console.log('usercount: done');
  });

  test('addUser, unique', async () => {
    const mutation = await createMutation('addUser');
    const variables = {
      username: samples.user1.username,
      password: samples.user1.password
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addUser).toBeDefined();
    expect(data.addUser).toHaveProperty('username', samples.user1.username);
    user = data.addUser;
    console.log('adduser - unique: done');
  });

  test('addUser, not unique', async () => {
    const mutation = await createMutation('addUser');
    const variables = {
      username: samples.user1.username,
      password: samples.user1.password
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('adduser - not unique: done');
  });

  test('new user, login:gql, fail', async () => {
    const mutation = await createMutation('login');
    const variables = {
      username: samples.user1.username,
      password: samples.user1.wrongPassword
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Invalid credentials!');
    console.log('new user - login - gql - fail: done');
  });

  test('new user, login:gql, success', async () => {
    const mutation = await createMutation('login');
    const variables = {
      username: samples.user1.username,
      password: samples.user1.password
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.login).toBeDefined();
    token = data.login.value;
    console.log('new user - login - gql - success: done');
  });

  test('userCount, revisited', async () => {
    const query = await createQuery('userCount');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.userCount).toBeDefined();
    expect(data.userCount).toBe(3);
    console.log('usercount - revisited: done');
  });

  test('users, active', async () => {
    const query = await createQuery('users');
    const variables = {
      token: masterToken.substring(7),
      active: true
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.users).toBeDefined();
    expect(data.users.length).toBe(1);
    console.log('users - active: done');
  });
  test('users, role', async () => {
    const query = await createQuery('users');
    const variables = {
      token: masterToken.substring(7),
      role: 'user'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.users).toBeDefined();
    expect(data.users.length).toBe(2);
    console.log('users - role: done');
  });
  test('users, username', async () => {
    const query = await createQuery('users');
    const variables = {
      token: masterToken.substring(7),
      username: samples.user1.username
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.users).toBeDefined();
    expect(data.users.length).toBe(1);
    expect(data.users[0].username).toMatch(samples.user1.username);
    console.log('users - username: done');
  });
  test('users, noArgs', async () => {
    const query = await createQuery('users');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.users).toBeDefined();
    expect(data.users.length).toBe(3);
    console.log('users - noargs: done');
  });
  test('promoteUser, fail, user:user', async () => {
    const mutation = await createMutation('promoteUser');
    const variables = {
      token: token.substring(7),
      id: user.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('promoteuser - user:user - fail: done');
  });
  test('promoteUser, success, owner:user', async () => {
    const mutation = await createMutation('promoteUser');
    const variables = {
      token: masterToken.substring(7),
      id: user.id
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.promoteUser).toBeDefined();
    expect(data.promoteUser.username).toMatch(user.username);
    console.log('promoteuser - owner:user - success: done');
  });
  test('demoteUser, fail, owner:owner', async () => {
    const mutation = await createMutation('demoteUser');
    const variables = {
      token: masterToken.substring(7),
      id: nullUser.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('demoteuser - owner:owner - fail: done');
  });
  test('demoteUser, fail, admin:owner', async () => {
    const mutation = await createMutation('demoteUser');
    const variables = {
      token: token.substring(7),
      id: nullUser.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('demoteuser - admin:owner - fail: done');
  });
  test('demoteUser, success, owner:admin', async () => {
    const mutation = await createMutation('demoteUser');
    const variables = {
      token: masterToken.substring(7),
      id: nullUser.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('demoteuser - owner:admin - success: done');
  });
  test('demoteUser, fail, user:owner', async () => {
    const mutation = await createMutation('demoteUser');
    const variables = {
      token: token.substring(7),
      id: nullUser.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('demoteuser - user:owner - fail: done');
  });
  test('updateUser:password, success', async () => {
    const mutation = await createMutation('updateUser');
    const variables = {
      token: token.substring(7),
      password: samples.user1.password,
      newPassword: samples.user1.wrongPassword
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.updateUser).toBeDefined();
    console.log('updateuser - password - success: done');
  });

  test('updateUser:username, success', async () => {
    const mutation = await createMutation('updateUser');
    const reversed = await usernameReverse(samples.user1.username);
    const variables = {
      token: token.substring(7),
      password: samples.user1.wrongPassword,
      newUsername: reversed
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.updateUser).toBeDefined();
    expect(data.updateUser.username).toMatch(reversed);
    usernameReversed = reversed;
    console.log('updateuser - username - success: done');
  });

  test('updateUser, fail', async () => {
    const mutation = await createMutation('updateUser');
    const variables = {
      token: token.substring(7),
      password: samples.user1.password,
      newUsername: samples.user1.username
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Invalid credentials!');
    console.log('updateuser - fail: done');
  });

  test('addStop', async () => {
    const mutation = await createMutation('addStop');
    const variables = {
      token: token.substring(7),
      stop: samples.stops[0]
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addStop).toBeDefined();
    expect(data.addStop.stops).toBeDefined();
    expect(data.addStop.stops.length).toBe(1);
    expect(data.addStop.stops[0]).toMatch(samples.stops[0]);
    console.log('addstop: done');
  });
  test('removeStop', async () => {
    const mutation = await createMutation('removeStop');
    const variables = {
      token: token.substring(7),
      stop: samples.stops[0]
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeStop).toBeDefined();
    expect(data.removeStop.stops).toBeDefined();
    expect(data.removeStop.stops.length).toBe(0);
    console.log('removestop: done');
  });

  test('deactivate user, fail', async () => {
    const mutation = await createMutation('deactivateUser');
    const variables = {
      token: token.substring(7),
      id: user.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const error = errors[0].message;
    expect(error).toMatch('You must be logged in!');
    console.log('deactivateuser - fail: done');
  });
  test('deactivate user, success', async () => {
    const mutation = await createMutation('deactivateUser');
    const variables = {
      token: masterToken.substring(7),
      id: user.id
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.deactivateUser).toBeDefined();
    expect(data.deactivateUser.username).toMatch(usernameReversed);
    console.log('deactivateuser - success: done');
  });
  test('activate user, fail', async () => {
    const mutation = await createMutation('activateUser');
    const variables = {
      token: token.substring(7),
      id: user.id
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const error = errors[0].message;
    expect(error).toMatch('You must be logged in!');
    console.log('activateuser - fail: done');
  });
  test('activate user, success', async () => {
    const mutation = await createMutation('activateUser');
    const variables = {
      token: masterToken.substring(7),
      id: user.id
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.activateUser).toBeDefined();
    expect(data.activateUser.username).toMatch(usernameReversed);
    console.log('activateuser - success: done');
  });

  test('removeUser, fail', async () => {
    const mutation = await createMutation('removeUser');
    const variables = {
      token: token.substring(7),
      id: user.id,
      password: samples.user1.password
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Invalid credentials!');
    console.log('removeuser - fail: done');
  });
  test('removeUser, success', async () => {
    const mutation = await createMutation('removeUser');
    const variables = {
      token: token.substring(7),
      id: user.id,
      password: samples.user1.wrongPassword
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeUser).toBeDefined();
    expect(data.removeUser.username).toMatch(usernameReversed);
    console.log('removeuser - success: done');
  });
});

// group tests
describe('API:test:group', () => {
  let masterToken;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
  });
  beforeEach(async () => {
    masterToken = await getNullToken();
  });

  test('groupCount', async () => {
    const query = await createQuery('groupCount');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.groupCount).toBe(0);
    console.log('groupcount: done');
  });
  test('addGroup, unique, success', async () => {
    const mutation = await createMutation('addGroup');
    const variables = {
      token: masterToken.substring(7),
      title: samples.group1.title
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addGroup).toBeDefined();
    expect(data.addGroup.title).toBeDefined();
    expect(data.addGroup.title).toMatch(samples.group1.title);
    console.log('addgroup - unique - success: done');
  });
  test('addGroup, non-unique, fail', async () => {
    const mutation = await createMutation('addGroup');
    const variables = {
      token: masterToken.substring(7),
      title: samples.group1.title
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addgroup - not unique - fail: done');
  });
  test('groupCount, revisited', async () => {
    const query = await createQuery('groupCount');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.groupCount).toBe(1);
    console.log('groupcount - revisited: done');
  });
  test('groups', async () => {
    const query = await createQuery('groups');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.groups).toBeDefined();
    expect(data.groups.length).toBe(1);
    const group = data.groups[0];
    expect(group.title).toMatch(samples.group1.title);
    console.log('groups: done');
  });
  test('allGroups, user', async () => {
    const query = await createQuery('allGroups');
    const variables = {
      token: dummyToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.allGroups).toBeDefined();
    expect(data.allGroups.length).toBe(0);
    console.log('allgroups - user: done');
  });
  test('allGroups, admin/owner', async () => {
    const query = await createQuery('allGroups');
    const variables = {
      token: masterToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.allGroups).toBeDefined();
    expect(data.allGroups.length).toBe(1);
    console.log('allgroups - admin/owner: done');
  });
  test('updateGroup, fail', async () => {
    const mut1 = await createMutation('addGroup');
    const var1 = {
      token: masterToken.substring(7),
      title: samples.group2.title
    };
    await tester.graphql(mut1, undefined, undefined, var1);
    const group = await Group.findOne({ title: samples.group2.title });

    const mutation = await createMutation('updateGroup');
    const variables = {
      token: masterToken.substring(7),
      id: group._id.toString(),
      title: samples.group1.title
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    await Group.findOneAndDelete({ title: samples.group2.title });
    console.log('updategroup - fail: done');
  });
  test('updateGroup, success', async () => {
    const mutation = await createMutation('updateGroup');
    const group = await Group.findOne({ title: samples.group1.title });
    const variables = {
      token: masterToken.substring(7),
      id: group._id.toString(),
      title: samples.group2.title
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.updateGroup).toBeDefined();
    expect(data.updateGroup.title).toMatch(samples.group2.title);
    console.log('updategroup - success: done');
  });
  test('activateGroup, user:fail', async () => {
    const mutation = await createMutation('activateGroup');
    const group = await Group.findOne({ title: samples.group2.title });
    const variables = {
      token: dummyToken.substring(7),
      id: group._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('activategroup - user:fail: done');
  });
  test('activateGroup, owner:success', async () => {
    const mutation = await createMutation('activateGroup');
    const group = await Group.findOne({ title: samples.group2.title });
    const variables = {
      token: masterToken.substring(7),
      id: group._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.activateGroup).toBeDefined();
    expect(data.activateGroup.title).toMatch(samples.group2.title);
    expect(data.activateGroup.active).toBe(true);
    console.log('activategroup - admin/owner:success: done');
  });
  test('deactivateGroup, user:fail', async () => {
    const mutation = await createMutation('deactivateGroup');
    const group = await Group.findOne({ title: samples.group2.title });
    const variables = {
      token: dummyToken.substring(7),
      id: group._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('deactivategroup - user:fail: done');
  });
  test('deactivateGroup, owner:success', async () => {
    const mutation = await createMutation('deactivateGroup');
    const group = await Group.findOne({ title: samples.group2.title });
    const variables = {
      token: masterToken.substring(7),
      id: group._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.deactivateGroup).toBeDefined();
    expect(data.deactivateGroup.title).toMatch(samples.group2.title);
    expect(data.deactivateGroup.active).toBe(false);
    console.log('deactivategroup - admin/owner:success: done');
  });
  test('removeGroup, fail', async () => {
    const mutation = await createMutation('removeGroup');
    const group = await Group.findOne({ title: samples.group2.title });
    const variables = {
      token: dummyToken.substring(7),
      id: group._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removegroup - fail: done');
  });
  test('removeGroup, success', async () => {
    const mutation = await createMutation('removeGroup');
    const group = await Group.findOne({ title: samples.group2.title });
    const variables = {
      token: masterToken.substring(7),
      id: group._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeGroup).toBeDefined();
    expect(data.removeGroup.title).toMatch(samples.group2.title);
    console.log('removegroup - success: done');
  });
});

// carb tests
describe('API:test:carb', () => {
  let token;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
  });
  beforeEach(async () => {
    token = await getNullToken();
  });
  afterAll(async () => {
    await resetIngredients();
  });

  test('carbCount', async () => {
    const query = await createQuery('carbCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.carbCount).toBeDefined();
    expect(data.carbCount).toBe(0);
    console.log('carbcount: done');
  });
  test('addIngredient, carb, unique, success', async () => {
    const mutation = await createMutation('addIngredient');
    const variables = {
      token: token.substring(7),
      type: 'carb',
      name: samples.carbs[0].name
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addIngredient).toBeDefined();
    expect(data.addIngredient.name).toBeDefined();
    expect(data.addIngredient.name).toMatch(samples.carbs[0].name);
    console.log('addingredient - carb - unique - success: done');
  });
  test('addIngredient, carb, non-unique, fail', async () => {
    const mutation = await createMutation('addIngredient');
    const variables = {
      token: token.substring(7),
      type: 'carb',
      name: samples.carbs[0].name
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addingredient - carb - not unique - fail: done');
  });
  test('carbCount, revisited', async () => {
    const query = await createQuery('carbCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.carbCount).toBeDefined();
    expect(data.carbCount).toBe(1);
    console.log('carbcount - revisited: done');
  });
  test('allCarbs', async () => {
    const query = await createQuery('allCarbs');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.allCarbs).toBeDefined();
    console.log('allcarbs: done');
  });
  test('removeIngredient, carb, fail', async () => {
    const mutation = await createMutation('removeIngredient');
    const carb = await Ingredient.findOne({ type: 'carb', name: samples.carbs[0].name });
    const variables = {
      token: dummyToken.substring(7),
      id: carb._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removeingredient - carb - fail: done');
  });
  test('removeIngredient, carb, success', async () => {
    const mutation = await createMutation('removeIngredient');
    const carb = await Ingredient.findOne({ type: 'carb', name: samples.carbs[0].name });
    const variables = {
      token: token.substring(7),
      id: carb._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeIngredient).toBeDefined();
    expect(data.removeIngredient.name).toBeDefined();
    expect(data.removeIngredient.name).toMatch(samples.carbs[0].name);
    console.log('removeingredient - carb - success: done');
  });
});

// method tests
describe('API:test:cookingMethod', () => {
  let token;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
  });
  beforeEach(async () => {
    token = await getNullToken();
  });
  afterAll(async () => {
    await resetMethods();
  });

  test('methodCount', async () => {
    const query = await createQuery('methodCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.methodCount).toBeDefined();
    expect(data.methodCount).toBe(0);
    console.log('methodcount: done');
  });
  test('addMethod, unique, success', async () => {
    const mutation = await createMutation('addMethod');
    const variables = {
      token: token.substring(7),
      name: samples.methods[0].name
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addMethod).toBeDefined();
    expect(data.addMethod.name).toBeDefined();
    expect(data.addMethod.name).toMatch(samples.methods[0].name);
    console.log('addmethod - unique - success: done');
  });
  test('addMethod, non-unique, fail', async () => {
    const mutation = await createMutation('addMethod');
    const variables = {
      token: token.substring(7),
      name: samples.methods[0].name
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addmethod - not unique - fail: done');
  });
  test('methodCount, revisited', async () => {
    const query = await createQuery('methodCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.methodCount).toBeDefined();
    expect(data.methodCount).toBe(1);
    console.log('methodcount - revisited: done');
  });
  test('allMethods', async () => {
    const query = await createQuery('allMethods');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    console.log('allmethods: done');
  });
  test('removeMethod, fail', async () => {
    const mutation = await createMutation('removeMethod');
    const method = await CookingMethod.findOne({ name: samples.methods[0].name });
    const variables = {
      token: dummyToken.substring(7),
      id: method._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removemethod - fail: done');
  });
  test('removeMethod, success', async () => {
    const mutation = await createMutation('removeMethod');
    const method = await CookingMethod.findOne({ name: samples.methods[0].name });
    const variables = {
      token: token.substring(7),
      id: method._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeMethod).toBeDefined();
    expect(data.removeMethod.name).toBeDefined();
    expect(data.removeMethod.name).toMatch(samples.methods[0].name);
    console.log('removemethod - success: done');
  });
});

// protein tests
describe('API:test:protein', () => {
  let token;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
  });
  beforeEach(async () => {
    token = await getNullToken();
  });
  afterAll(async () => {
    await resetIngredients();
  });

  test('proteinCount', async () => {
    const query = await createQuery('proteinCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.proteinCount).toBeDefined();
    expect(data.proteinCount).toBe(0);
    console.log('proteincount: done');
  });
  test('addIngredient, protein, unique, success', async () => {
    const mutation = await createMutation('addIngredient');
    const variables = {
      token: token.substring(7),
      type: 'protein',
      name: samples.proteins[0].name
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addIngredient).toBeDefined();
    expect(data.addIngredient.name).toBeDefined();
    expect(data.addIngredient.name).toMatch(samples.proteins[0].name);
    console.log('addingredient - protein - unique - success: done');
  });
  test('addIngredient, protein, non-unique, fail', async () => {
    const mutation = await createMutation('addIngredient');
    const variables = {
      token: token.substring(7),
      type: 'protein',
      name: samples.proteins[0].name
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addingredient - protein - not unique - fail: done');
  });
  test('proteinCount, revisited', async () => {
    const query = await createQuery('proteinCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.proteinCount).toBeDefined();
    expect(data.proteinCount).toBe(1);
    console.log('proteincount - revisited: done');
  });
  test('allProteins', async () => {
    const query = await createQuery('allProteins');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    console.log('allproteins: done');
  });
  test('removeIngredient, protein, fail', async () => {
    const mutation = await createMutation('removeIngredient');
    const protein = await Ingredient.findOne({ type: 'protein', name: samples.proteins[0].name });
    const variables = {
      token: dummyToken.substring(7),
      id: protein._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removeingredient - protein - fail: done');
  });
  test('removeIngredient, protein, success', async () => {
    const mutation = await createMutation('removeIngredient');
    const protein = await Ingredient.findOne({ type: 'protein', name: samples.proteins[0].name });
    const variables = {
      token: token.substring(7),
      id: protein._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeIngredient).toBeDefined();
    expect(data.removeIngredient.name).toBeDefined();
    expect(data.removeIngredient.name).toMatch(samples.proteins[0].name);
    console.log('removeingredient - protein - success: done');
  });
});

// spice tests
describe('API:test:spice', () => {
  let token;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
  });
  beforeEach(async () => {
    token = await getNullToken();
  });
  afterAll(async () => {
    await resetIngredients();
  });

  test('spiceCount', async () => {
    const query = await createQuery('spiceCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.spiceCount).toBeDefined();
    expect(data.spiceCount).toBe(0);
    console.log('spicecount: done');
  });
  test('addIngredient, spice, unique, success', async () => {
    const mutation = await createMutation('addIngredient');
    const variables = {
      token: token.substring(7),
      type: 'spice',
      name: samples.spices[0].name
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addIngredient).toBeDefined();
    expect(data.addIngredient.name).toBeDefined();
    expect(data.addIngredient.name).toMatch(samples.spices[0].name);
    console.log('addingredient - spice - unique - success: done');
  });
  test('addIngredient, spice, non-unique, fail', async () => {
    const mutation = await createMutation('addIngredient');
    const variables = {
      token: token.substring(7),
      type: 'spice',
      name: samples.spices[0].name
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addingredient - spice - not unique - fail: done');
  });
  test('spiceCount, revisited', async () => {
    const query = await createQuery('spiceCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.spiceCount).toBeDefined();
    expect(data.spiceCount).toBe(1);
    console.log('spicecount - revisited: done');
  });
  test('allSpices', async () => {
    const query = await createQuery('allSpices');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    console.log('allspices: done');
  });
  test('removeIngredient, spice, fail', async () => {
    const mutation = await createMutation('removeIngredient');
    const spice = await Ingredient.findOne({ type: 'spice', name: samples.spices[0].name });
    const variables = {
      token: dummyToken.substring(7),
      id: spice._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removeingredient - spice - fail: done');
  });
  test('removeIngredient, spice, success', async () => {
    const mutation = await createMutation('removeIngredient');
    const spice = await Ingredient.findOne({ type: 'spice', name: samples.spices[0].name });
    const variables = {
      token: token.substring(7),
      id: spice._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeIngredient).toBeDefined();
    expect(data.removeIngredient.name).toBeDefined();
    expect(data.removeIngredient.name).toMatch(samples.spices[0].name);
    console.log('removeingredient - spice - success: done');
  });
});

// dish tests
describe('API:test:dish', () => {
  let token;
  let dummyToken;
  let user;
  let dish;
  let proteins;
  let spices;
  let carbs;
  let methods;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
    user = await User.findOne({ username: samples.dummyUser.username });
    await setIngredients(user._id);
    methods = await tester.graphql(
      await createQuery('allMethods'),
      undefined,
      undefined,
      {});
    proteins = await tester.graphql(
      await createQuery('allProteins'),
      undefined,
      undefined,
      {});
    carbs = await tester.graphql(
      await createQuery('allCarbs'),
      undefined,
      undefined,
      {});
    spices = await tester.graphql(
      await createQuery('allSpices'),
      undefined,
      undefined,
      {});
  });
  beforeEach(async () => {
    token = await getNullToken();
  });

  test('dishCount', async () => {
    const query = await createQuery('dishCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.dishCount).toBeDefined();
    expect(data.dishCount).toBe(0);
    console.log('dishcount: done');
  });
  test('addDish, unique, success', async () => {
    const values = {
      method: methods.data.allMethods[0].name,
      carb: carbs.data.allCarbs[0].name,
      protein: proteins.data.allProteins[0].name,
      spice: spices.data.allSpices[0].name,
      note: samples.dishNote1
    };
    const mutation = await createMutation('addDish');
    const variables = {
      token: token.substring(7),
      name: samples.dish1.name,
      cookingMethods: [
        methods.data.allMethods[0].id
      ],
      carbs: [
        carbs.data.allCarbs[0].id
      ],
      proteins: [
        proteins.data.allProteins[0].id
      ],
      spices: [
        spices.data.allSpices[0].id
      ],
      note: samples.dishNote1
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addDish).toBeDefined();
    expect(data.addDish.name).toMatch(samples.dish1.name);
    expect(data.addDish.carbs[0].name).toMatch(values.carb);
    expect(data.addDish.proteins[0].name).toMatch(values.protein);
    expect(data.addDish.spices[0].name).toMatch(values.spice);
    expect(data.addDish.cookingMethods[0].name).toMatch(values.method);
    expect(data.addDish.note).toMatch(values.note);
    expect(data.addDish.addedBy.username).toMatch(samples.nullUser.username);
    console.log('adddish - unique - success: done');
  });
  test('addDish, non-unique, fail', async () => {
    const mutation = await createMutation('addDish');
    const variables = {
      token: token.substring(7),
      name: samples.dish1.name,
      cookingMethods: [
        methods.data.allMethods[1].id
      ],
      carbs: [
        carbs.data.allCarbs[1].id
      ],
      proteins: [
        proteins.data.allProteins[1].id
      ],
      spices: [
        spices.data.allSpices[1].id
      ],
      note: samples.dishNote2
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('adddish - not unique - fail: done');
  });
  test('dishCount, revisited', async () => {
    const query = await createQuery('dishCount');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.dishCount).toBeDefined();
    expect(data.dishCount).toBe(1);
    console.log('dishcount - revisited: done');
  });
  test('allDishes', async () => {
    const query = await createQuery('allDishes');
    const { data } = await tester.graphql(query, undefined, undefined, {});
    expect(data).toBeDefined();
    expect(data.allDishes).toBeDefined();
    expect(data.allDishes.length).toBe(1);
    console.log('alldishes: done');
  });
  test('findDish, carb', async () => {
    const query = await createQuery('dishes');
    const variables = {
      carb: carbs.data.allCarbs[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].carbs).toBeDefined();
    expect(data.dishes[0].carbs[0].name).toMatch(carbs.data.allCarbs[0].name);
    console.log('finddish - carb: done');
  });
  test('findDish, method', async () => {
    const query = await createQuery('dishes');
    const variables = {
      method: methods.data.allMethods[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].cookingMethods).toBeDefined();
    expect(data.dishes[0].cookingMethods[0].name).toMatch(methods.data.allMethods[0].name);
    console.log('finddish - method: done');
  });
  test('findDish, protein', async () => {
    const query = await createQuery('dishes');
    const variables = {
      protein: proteins.data.allProteins[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].proteins).toBeDefined();
    expect(data.dishes[0].proteins[0].name).toMatch(proteins.data.allProteins[0].name);
    console.log('finddish - protein: done');
  });
  test('findDish, spice', async () => {
    const query = await createQuery('dishes');
    const variables = {
      spice: spices.data.allSpices[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].spices).toBeDefined();
    expect(data.dishes[0].spices[0].name).toMatch(spices.data.allSpices[0].name);
    console.log('finddish - spice: done');
  });
  test('findDish, carb & method', async () => {
    const query = await createQuery('dishes');
    const variables = {
      carb: carbs.data.allCarbs[0].name,
      method: methods.data.allMethods[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].carbs).toBeDefined();
    expect(data.dishes[0].cookingMethods).toBeDefined();
    expect(data.dishes[0].cookingMethods[0].name).toMatch(methods.data.allMethods[0].name);
    expect(data.dishes[0].carbs[0].name).toMatch(carbs.data.allCarbs[0].name);
    console.log('finddish - carb & method: done');
  });
  test('findDish, carb & method & spice', async () => {
    const query = await createQuery('dishes');
    const variables = {
      carb: carbs.data.allCarbs[0].name,
      method: methods.data.allMethods[0].name,
      spice: spices.data.allSpices[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].carbs).toBeDefined();
    expect(data.dishes[0].cookingMethods).toBeDefined();
    expect(data.dishes[0].spices).toBeDefined();
    expect(data.dishes[0].cookingMethods[0].name).toMatch(methods.data.allMethods[0].name);
    expect(data.dishes[0].carbs[0].name).toMatch(carbs.data.allCarbs[0].name);
    expect(data.dishes[0].spices[0].name).toMatch(spices.data.allSpices[0].name);
    console.log('finddish - carb & method & spice: done');
  });
  test('findDish, carb & method & spice & protein', async () => {
    const query = await createQuery('dishes');
    const variables = {
      carb: carbs.data.allCarbs[0].name,
      method: methods.data.allMethods[0].name,
      spice: spices.data.allSpices[0].name,
      protein: proteins.data.allProteins[0].name
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishes).toBeDefined();
    expect(data.dishes[0].carbs).toBeDefined();
    expect(data.dishes[0].cookingMethods).toBeDefined();
    expect(data.dishes[0].spices).toBeDefined();
    expect(data.dishes[0].proteins).toBeDefined();
    expect(data.dishes[0].proteins[0].name).toMatch(proteins.data.allProteins[0].name);
    expect(data.dishes[0].cookingMethods[0].name).toMatch(methods.data.allMethods[0].name);
    expect(data.dishes[0].carbs[0].name).toMatch(carbs.data.allCarbs[0].name);
    expect(data.dishes[0].spices[0].name).toMatch(spices.data.allSpices[0].name);
    console.log('finddish - carb & method & spice & protein: done');
  });
  test('updateDish', async () => {
    const mutation = await createMutation('updateDish');
    dish = await Dish.findOne({ name: samples.dish1.name });
    const dishMethods = dish.cookingMethods.map(m => m.toString());
    const dishCarbs = dish.carbs.map(c => c.toString());
    const dishProteins = dish.proteins.map(p => p.toString());
    const dishSpices = dish.spices.map(s => s.toString());
    const variables = {
      token: token.substring(7),
      id: dish._id.toString(),
      methods: [...dishMethods, methods.data.allMethods[1].id],
      carbs: [...dishCarbs, carbs.data.allCarbs[1].id],
      proteins: [...dishProteins, proteins.data.allProteins[1].id],
      spices: [...dishSpices, spices.data.allSpices[1].id],
      karma: -10,
      note: samples.dishNote2
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.updateDish).toBeDefined();
    expect(data.updateDish.name).toMatch(samples.dish1.name);
    expect(data.updateDish.cookingMethods.length).toBe(2);
    expect(data.updateDish.carbs.length).toBe(2);
    expect(data.updateDish.proteins.length).toBe(2);
    expect(data.updateDish.spices.length).toBe(2);
    expect(data.updateDish.karma).toBe(-10);
    expect(data.updateDish.note).toMatch(samples.dishNote2);
    console.log('updatedish: done');
  });
  test('dishKarma, up', async () => {
    const mutation = await createMutation('dishKarma');
    const dish = await Dish.findOne({ name: samples.dish1.name });
    const variables = {
      token: token.substring(7),
      vote: 'up',
      id: dish._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishKarma).toBeDefined();
    expect(data.dishKarma.name).toMatch(samples.dish1.name);
    expect(data.dishKarma.karma).toBe(-9);
    console.log('dishkarma - up: done');
  });
  test('dishKarma, down', async () => {
    const mutation = await createMutation('dishKarma');
    const dish = await Dish.findOne({ name: samples.dish1.name });
    const variables = {
      token: token.substring(7),
      vote: 'down',
      id: dish._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.dishKarma).toBeDefined();
    expect(data.dishKarma.name).toMatch(samples.dish1.name);
    expect(data.dishKarma.karma).toBe(-10);
    console.log('dishkarma - down: done');
  });
  test('removeDish, fail', async () => {
    const mutation = await createMutation('removeDish');
    const dish = await Dish.findOne({ name: samples.dish1.name });
    const variables = {
      token: dummyToken.substring(7),
      id: dish._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removedish - fail: done');
  });
  test('removeDish, success', async () => {
    const mutation = await createMutation('removeDish');
    const dish = await Dish.findOne({ name: samples.dish1.name });
    const variables = {
      token: token.substring(7),
      id: dish._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeDish).toBeDefined();
    expect(data.removeDish.name).toMatch(samples.dish1.name);
    console.log('removedish - success: done');
  });
});

// list:private tests
describe('API:test:privateList', () => {
  let token;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
  });
  beforeEach(async () => {
    token = await getNullToken();
  });

  test('privateLists', async () => {
    const query = await createQuery('privateLists');
    const variables = {
      token: dummyToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.privateLists).toBeDefined();
    expect(data.privateLists.length).toBe(0);
    console.log('privatelists: done');
  });
  test('addListPrivate, unique, success', async () => {
    const mutation = await createMutation('addListPrivate');
    const variables = {
      token: dummyToken.substring(7),
      title: samples.privateList1.title
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addListPrivate).toBeDefined();
    expect(data.addListPrivate.title).toMatch(samples.privateList1.title);
    expect(data.addListPrivate.listType).toMatch('PrivateList');
    expect(data.addListPrivate.owner.username).toMatch(samples.dummyUser.username);
    console.log('addprivatelist - unique - success: done');
  });
  test('addListPrivate, non-unique, fail', async () => {
    const mutation = await createMutation('addListPrivate');
    const variables = {
      token: dummyToken.substring(7),
      title: samples.privateList1.title
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addprivatelist - not unique - fail: done');
  });
  test('privateLists, revisited', async () => {
    const query = await createQuery('privateLists');
    const variables = {
      token: dummyToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.privateLists).toBeDefined();
    expect(data.privateLists.length).toBe(1);
    expect(data.privateLists[0].title).toMatch(samples.privateList1.title);
    console.log('privatelists - revisited: done');
  });
  test('removeListPrivate, fail', async () => {
    const mutation = await createMutation('removeListPrivate');
    const list = await PrivateList.findOne({ title: samples.privateList1.title });
    const variables = {
      id: list._id.toString(),
      token: token.substring(7)
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removeprivatelist - fail: done');
  });
  test('removeListPrivate, success', async () => {
    const mutation = await createMutation('removeListPrivate');
    const list = await PrivateList.findOne({ title: samples.privateList1.title });
    const variables = {
      id: list._id.toString(),
      token: dummyToken.substring(7)
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeListPrivate).toBeDefined();
    expect(data.removeListPrivate.title).toMatch(samples.privateList1.title);
    console.log('removeprivatelist - success: done');
  });
});

// list:group tests
describe('API:test:groupList', () => {
  let token;
  let dummyToken;

  beforeAll(async () => {
    dummyToken = await getDummyToken();
    await tester.graphql(
      await createMutation('addGroup'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        title: samples.group1.title
      });
  });
  beforeEach(async () => {
    token = await getNullToken();
  });

  test('groupLists', async () => {
    const query = await createQuery('groupLists');
    const variables = {
      token: dummyToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.groupLists).toBeDefined();
    expect(data.groupLists.length).toBe(0);
    console.log('grouplists: done');
  });
  test('addListGroup, unique, success', async () => {
    const group = await Group.findOne({ title: samples.group1.title });
    const mutation = await createMutation('addListGroup');
    const variables = {
      token: token.substring(7),
      title: samples.groupList1.title,
      group: group._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addListGroup).toBeDefined();
    expect(data.addListGroup.listType).toMatch('GroupList');
    expect(data.addListGroup.title).toMatch(samples.groupList1.title);
    expect(data.addListGroup.group.title).toMatch(group.title);
    console.log('addgrouplist - unique - success: done');
  });
  test('addListGroup, non-unique, fail', async () => {
    const group = await Group.findOne({ title: samples.group1.title });
    const mutation = await createMutation('addListGroup');
    const variables = {
      token: token.substring(7),
      title: samples.groupList1.title,
      group: group._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message.substring(0, 38);
    expect(message).toMatch('E11000 duplicate key error collection:');
    console.log('addgrouplist - not unique - fail: done');
  });
  test('groupLists, revisited', async () => {
    const query = await createQuery('groupLists');
    const variables = {
      token: dummyToken.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.groupLists).toBeDefined();
    expect(data.groupLists.length).toBe(1);
    expect(data.groupLists[0].title).toMatch(samples.groupList1.title);
    console.log('grouplists - revisited: done');
  });
  test('removeListGroup, fail', async () => {
    const list = await GroupList.findOne({ title: samples.groupList1.title });
    const mutation = await createMutation('removeListGroup');
    const variables = {
      id: list._id.toString(),
      token: dummyToken.substring(7)
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removegrouplist - fail: done');
  });
  test('removeListGroup, success', async () => {
    const list = await GroupList.findOne({ title: samples.groupList1.title });
    const mutation = await createMutation('removeListGroup');
    const variables = {
      id: list._id.toString(),
      token: token.substring(7)
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeListGroup).toBeDefined();
    expect(data.removeListGroup.title).toMatch(samples.groupList1.title);
    console.log('removegrouplist - success: done');
  });
});

// comment tests
describe('API:test:comment', () => {
  let token;
  let dummyToken;
  let privateList;
  let groupList;

  beforeAll(async () => {
    const groups = await Group.find({});
    dummyToken = await getDummyToken();
    privateList = await privateListInit(dummyToken.substring(7));
    groupList = await groupListInit(dummyToken.substring(7), groups[0]._id.toString());
  });
  beforeEach(async () => {
    token = await getNullToken();
  });
  test('comments, privateList', async () => {
    const { data } = await tester.graphql(
      await createQuery('comments'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: privateList._id.toString()
      });
    expect(data).toBeDefined();
    expect(data.comments).toBeDefined();
    expect(data.comments.length).toBe(0);
    console.log('comments - privatelist: done');
  });
  test('comments, groupList', async () => {
    const { data } = await tester.graphql(
      await createQuery('comments'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: groupList._id.toString()
      });
    expect(data).toBeDefined();
    expect(data.comments).toBeDefined();
    expect(data.comments.length).toBe(0);
    console.log('comments - grouplist: done');
  });
  test('addComment, privateList', async () => {
    const { data } = await tester.graphql(
      await createMutation('addComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        listID: privateList._id.toString(),
        comment: samples.genericCommentP
      });
    expect(data).toBeDefined();
    expect(data.addComment).toBeDefined();
    expect(data.addComment.listID).toMatch(privateList._id.toString());
    expect(data.addComment.comment).toMatch(samples.genericCommentP);
    expect(data.addComment.addedBy.username).toMatch(samples.dummyUser.username);
    console.log('addcomment - privatelist: done');
  });
  test('addComment, groupList', async () => {
    const { data } = await tester.graphql(
      await createMutation('addComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        listID: groupList._id.toString(),
        comment: samples.genericCommentG
      });
    expect(data).toBeDefined();
    expect(data.addComment).toBeDefined();
    expect(data.addComment.listID).toMatch(groupList._id.toString());
    expect(data.addComment.comment).toMatch(samples.genericCommentG);
    expect(data.addComment.addedBy.username).toMatch(samples.dummyUser.username);
    console.log('addcomment - grouplist: done');
  });
  test('comments, privateList, revisited', async () => {
    const { data } = await tester.graphql(
      await createQuery('comments'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: privateList._id.toString()
      });
    expect(data).toBeDefined();
    expect(data.comments).toBeDefined();
    expect(data.comments.length).toBe(1);
    expect(data.comments[0].karma).toBe(0);
    console.log('comments - privatelist - revisited: done');
  });
  test('comments, groupList, revisited', async () => {
    const { data } = await tester.graphql(
      await createQuery('comments'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: groupList._id.toString()
      });
    expect(data).toBeDefined();
    expect(data.comments).toBeDefined();
    expect(data.comments.length).toBe(1);
    expect(data.comments[0].karma).toBe(0);
    console.log('comments - grouplist - revisited: done');
  });
  test('voteComment, privateList:comment:up', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentP });
    await tester.graphql(
      await createMutation('voteComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString(),
        vote: 'up'
      });
    const { data } = await tester.graphql(
      await createMutation('voteComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString(),
        vote: 'up'
      });
    expect(data).toBeDefined();
    expect(data.voteComment).toBeDefined();
    expect(data.voteComment.karma).toBe(2);
    console.log('votecomment - privatelist - up: done');
  });
  test('voteComment, privateList:comment:down', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentP });
    const { data } = await tester.graphql(
      await createMutation('voteComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString(),
        vote: 'down'
      });
    expect(data).toBeDefined();
    expect(data.voteComment).toBeDefined();
    expect(data.voteComment.karma).toBe(1);
    console.log('votecomment - privatelist - down: done');
  });
  test('voteComment, groupList:comment:up', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentG });
    const { data } = await tester.graphql(
      await createMutation('voteComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString(),
        vote: 'up'
      });
    expect(data).toBeDefined();
    expect(data.voteComment).toBeDefined();
    expect(data.voteComment.karma).toBe(1);
    console.log('votecomment - grouplist - up: done');
  });
  test('voteComment, groupList:comment:down', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentG });
    await tester.graphql(
      await createMutation('voteComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString(),
        vote: 'down'
      });
    const { data } = await tester.graphql(
      await createMutation('voteComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString(),
        vote: 'down'
      });
    expect(data).toBeDefined();
    expect(data.voteComment).toBeDefined();
    expect(data.voteComment.karma).toBe(-1);
    console.log('votecomment - grouplist - down: done');
  });
  test('removeComment, groupList:comment, fail', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentG });
    const { errors } = await tester.graphql(
      await createMutation('removeComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString()
      });
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removecomment - grouplist - fail: done');
  });
  test('removeComment, privateList:comment, fail', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentP });
    const { errors } = await tester.graphql(
      await createMutation('removeComment'),
      undefined, undefined,
      {
        token: dummyToken.substring(7),
        id: comment._id.toString()
      });
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removecomment - privatelist - fail: done');
  });
  test('removeComment, groupList:comment, success', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentG });
    const { data } = await tester.graphql(
      await createMutation('removeComment'),
      undefined, undefined,
      {
        token: token.substring(7),
        id: comment._id.toString()
      });
    expect(data).toBeDefined();
    expect(data.removeComment).toBeDefined();
    expect(data.removeComment.id).toMatch(comment._id.toString());
    expect(data.removeComment.comment).toMatch(comment.comment);
    console.log('removecomment - grouplist - success: done');
  });
  test('removeComment, privateList:comment, success', async () => {
    const comment = await Comment.findOne({ comment: samples.genericCommentP });
    const { data } = await tester.graphql(
      await createMutation('removeComment'),
      undefined, undefined,
      {
        token: token.substring(7),
        id: comment._id.toString()
      });
    expect(data).toBeDefined();
    expect(data.removeComment).toBeDefined();
    expect(data.removeComment.id).toMatch(comment._id.toString());
    expect(data.removeComment.comment).toMatch(comment.comment);
    console.log('removecomment - privatelist - success: done');
  });
});

// task tests
describe('API:test:task', () => {
  let token;
  let dummyToken;
  let privateList;
  let groupList;

  beforeAll(async () => {
    const groups = await Group.find({});
    dummyToken = await getDummyToken();
    privateList = await privateListInit(dummyToken.substring(7));
    groupList = await groupListInit(dummyToken.substring(7), groups[0]._id.toString());
  });
  beforeEach(async () => {
    token = await getNullToken();
  });
  test('allTaskCount', async () => {
    const query = await createQuery('allTaskCount');
    const variables = {
      token: token.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.allTaskCount).toBeDefined();
    expect(data.allTaskCount).toBe(0);
    console.log('alltaskcount: done');
  });
  test('taskCount, privateList', async () => {
    const query = await createQuery('taskCount');
    const variables = {
      token: dummyToken.substring(7),
      countType: 'user'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskCount).toBeDefined();
    expect(data.taskCount).toBe(0);
    console.log('taskcount - privatelist: done');
  });
  test('taskCount, groupList', async () => {
    const query = await createQuery('taskCount');
    const variables = {
      token: dummyToken.substring(7),
      countType: 'group'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskCount).toBeDefined();
    expect(data.taskCount).toBe(0);
    console.log('taskcount - grouplist: done');
  });
  test('taskCount, total', async () => {
    const query = await createQuery('taskCount');
    const variables = {
      token: dummyToken.substring(7),
      countType: 'total'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskCount).toBeDefined();
    expect(data.taskCount).toBe(0);
    console.log('taskcount - total: done');
  });
  test('tasks, privateList', async () => {
    const query = await createQuery('tasks');
    const variables = {
      token: token.substring(7),
      listID: privateList._id.toString()
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.tasks).toBeDefined();
    expect(data.tasks.length).toBe(0);
    console.log('tasks - privatelist: done');
  });
  test('tasks, groupList', async () => {
    const query = await createQuery('tasks');
    const variables = {
      token: token.substring(7),
      listID: groupList._id.toString()
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.tasks).toBeDefined();
    expect(data.tasks.length).toBe(0);
    console.log('tasks - grouplist: done');
  });

  test('addTask, privateList', async () => {
    const mutation = await createMutation('addTask');
    const variables = {
      token: dummyToken.substring(7),
      task: samples.genericTaskP.task,
      listID: privateList._id.toString(),
      priority: false
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addTask).toBeDefined();
    expect(data.addTask.task).toMatch(samples.genericTaskP.task);
    expect(data.addTask.priority).toBe(false);
    expect(data.addTask.creator.username).toMatch(samples.dummyUser.username);
    console.log('addtask - privatelist: done');
  });
  test('addTask, groupList', async () => {
    const mutation = await createMutation('addTask');
    const variables = {
      token: dummyToken.substring(7),
      task: samples.genericTaskG.task,
      listID: groupList._id.toString(),
      priority: false
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addTask).toBeDefined();
    expect(data.addTask.task).toMatch(samples.genericTaskG.task);
    expect(data.addTask.priority).toBe(false);
    expect(data.addTask.creator.username).toMatch(samples.dummyUser.username);
    console.log('addtask - grouplist: done');
  });

  test('taskPriority, privateList:task, priority', async () => {
    const task = await Task.findOne({ task: samples.genericTaskP.task });
    const mutation = await createMutation('taskPriority');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString(),
      priority: !task.priority
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskPriority).toBeDefined();
    expect(data.taskPriority.priority).toBe(true);
    expect(data.taskPriority.task).toMatch(samples.genericTaskP.task);
    console.log('taskpriority - privatelist - task - priority: done');
  });
  test('taskPriority, groupList:task, priority', async () => {
    const task = await Task.findOne({ task: samples.genericTaskG.task });
    const mutation = await createMutation('taskPriority');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString(),
      priority: !task.priority
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskPriority).toBeDefined();
    expect(data.taskPriority.priority).toBe(true);
    expect(data.taskPriority.task).toMatch(samples.genericTaskG.task);
    console.log('taskpriority - grouplist - task - priority: done');
  });
  test('taskPriority, privateList:task, non-priority', async () => {
    const task = await Task.findOne({ task: samples.genericTaskP.task });
    const mutation = await createMutation('taskPriority');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString(),
      priority: !task.priority
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskPriority).toBeDefined();
    expect(data.taskPriority.priority).toBe(false);
    expect(data.taskPriority.task).toMatch(samples.genericTaskP.task);
    console.log('taskpriority - privatelist - task - non-priority: done');
  });
  test('taskPriority, groupList:task, non-priority', async () => {
    const task = await Task.findOne({ task: samples.genericTaskG.task });
    const mutation = await createMutation('taskPriority');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString(),
      priority: !task.priority
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskPriority).toBeDefined();
    expect(data.taskPriority.priority).toBe(false);
    expect(data.taskPriority.task).toMatch(samples.genericTaskG.task);
    console.log('taskpriority - grouplist - task - non-priority: done');
  });

  test('allTaskCount, revisited', async () => {
    const query = await createQuery('allTaskCount');
    const variables = {
      token: token.substring(7)
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.allTaskCount).toBeDefined();
    expect(data.allTaskCount).toBe(2);
    console.log('alltaskcount - revisited: done');
  });
  test('taskCount, privateList, revisited', async () => {
    const query = await createQuery('taskCount');
    const variables = {
      token: dummyToken.substring(7),
      countType: 'user'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskCount).toBeDefined();
    expect(data.taskCount).toBe(1);
    console.log('taskcount - privatelist - revisited: done');
  });
  test('taskCount, groupList, revisited', async () => {
    const query = await createQuery('taskCount');
    const variables = {
      token: dummyToken.substring(7),
      countType: 'group'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskCount).toBeDefined();
    expect(data.taskCount).toBe(1);
    console.log('taskcount - grouplist - revisited: done');
  });
  test('taskCount, total, revisited', async () => {
    const query = await createQuery('taskCount');
    const variables = {
      token: dummyToken.substring(7),
      countType: 'total'
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskCount).toBeDefined();
    expect(data.taskCount).toBe(2);
    console.log('taskcount - total - revisited: done');
  });
  test('tasks, privateList, revisited', async () => {
    const query = await createQuery('tasks');
    const variables = {
      token: dummyToken.substring(7),
      listID: privateList._id.toString()
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.tasks).toBeDefined();
    expect(data.tasks.length).toBe(1);
    expect(data.tasks[0].task).toMatch(samples.genericTaskP.task);
    console.log('tasks - privatelist - revisited: done');
  });
  test('tasks, groupList, revisited', async () => {
    const query = await createQuery('tasks');
    const variables = {
      token: dummyToken.substring(7),
      listID: groupList._id.toString()
    };
    const { data } = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.tasks).toBeDefined();
    expect(data.tasks.length).toBe(1);
    expect(data.tasks[0].task).toMatch(samples.genericTaskG.task);
    console.log('tasks - grouplist - revisited: done');
  });

  test('deactivateTask, privateList', async () => {
    const task = await Task.findOne({ listID: privateList._id.toString() });
    const mutation = await createMutation('taskDeactivation');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskDeactivation).toBeDefined();
    expect(data.taskDeactivation.task).toMatch(samples.genericTaskP.task);
    expect(data.taskDeactivation.active).toBe(false);
    console.log('deactivatetask - privatelist: done');
  });
  test('deactivateTask, groupList', async () => {
    const task = await Task.findOne({ listID: groupList._id.toString() });
    const mutation = await createMutation('taskDeactivation');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskDeactivation).toBeDefined();
    expect(data.taskDeactivation.task).toMatch(samples.genericTaskG.task);
    expect(data.taskDeactivation.active).toBe(false);
    console.log('deactivatetask - grouplist: done');
  });
  test('activateTask, privateList', async () => {
    const task = await Task.findOne({ listID: privateList._id.toString() });
    const mutation = await createMutation('taskActivation');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskActivation).toBeDefined();
    expect(data.taskActivation.task).toMatch(samples.genericTaskP.task);
    expect(data.taskActivation.active).toBe(true);
    console.log('activatetask - privatelist: done');
  });
  test('activateTask, groupList', async () => {
    const task = await Task.findOne({ listID: groupList._id.toString() });
    const mutation = await createMutation('taskActivation');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.taskActivation).toBeDefined();
    expect(data.taskActivation.task).toMatch(samples.genericTaskG.task);
    expect(data.taskActivation.active).toBe(true);
    console.log('activatetask - grouplist: done');
  });

  test('removeTask, privateList:task, fail', async () => {
    const task = await Task.findOne({ listID: privateList._id.toString() });
    const mutation = await createMutation('removeTask');
    const variables = {
      token: token.substring(7),
      id: task._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removetask - privatelist - fail: done');
  });
  test('removeTask, groupList:task, fail', async () => {
    const task = await Task.findOne({ listID: groupList._id.toString() });
    const mutation = await createMutation('removeTask');
    const variables = {
      token: token.substring(7),
      id: task._id.toString()
    };
    const { errors } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(errors).toBeDefined();
    const message = errors[0].message;
    expect(message).toMatch('Insufficient clearance!');
    console.log('removetask - grouplist - fail: done');
  });
  test('removeTask, privateList:task, success', async () => {
    const task = await Task.findOne({ listID: privateList._id.toString() });
    const mutation = await createMutation('removeTask');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeTask).toBeDefined();
    expect(data.removeTask.id).toMatch(task._id.toString());
    expect(data.removeTask.task).toMatch(task.task);
    expect(data.removeTask.active).toBe(true);
    console.log('removetask - privatelist - success: done');
  });
  test('removeTask, groupList:task, success', async () => {
    const task = await Task.findOne({ listID: groupList._id.toString() });
    const mutation = await createMutation('removeTask');
    const variables = {
      token: dummyToken.substring(7),
      id: task._id.toString()
    };
    const { data } = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeTask).toBeDefined();
    expect(data.removeTask.id).toMatch(task._id.toString());
    expect(data.removeTask.task).toMatch(task.task);
    expect(data.removeTask.active).toBe(true);
    console.log('removetask - grouplist - success: done');
  });
});
describe('API:test:news', () => {
  let token;
  let news1;
  beforeAll(async () => {
    token = await getNullToken();
  });
  test('news', async () => {
    const query = await createQuery('news');
    const variables = {};
    const {data} = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.news).toBeDefined();
    expect(data.news.length).toBe(5);
    console.log('news: done');
  });
  test('categoryNews', async () => {
    const query = await createQuery('categoryNews');
    const variables = {
      category: 'test'
    };
    const {data} = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.categoryNews).toBeDefined();
    expect(data.categoryNews.length).toBe(0);
    console.log('categoryNews - test: done');
  });
  test('addNews', async () => {
    const mutation = await createMutation('addNews');
    const variables = {
      token: token.substring(7),
      content: samples.news[0].content,
      category: samples.news[0].category
    };
    const {data} = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.addNews).toBeDefined();
    expect(data.addNews.content).toMatch(samples.news[0].content);
    expect(data.addNews.category).toMatch('test');
    news1 = data.addNews;
    console.log('addNews: done');
  });
  test('editNews', async () => {
    const mutation = await createMutation('editNews');
    const variables = {
      token: token.substring(7),
      id: news1.id,
      content: samples.news[1].content,
      category: samples.news[0].category
    };
    const {data} = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.editNews).toBeDefined();
    expect(data.editNews.content).toMatch(samples.news[1].content);
    expect(data.editNews.category).toMatch('test');
    news1 = data.editNews;
    console.log('editNews: done');
  });
  test('news, revisited', async () => {
    const query = await createQuery('news');
    const {data} = await tester.graphql(query, undefined, undefined, undefined);
    expect(data).toBeDefined();
    expect(data.news).toBeDefined();
    expect(data.news.length).toBe(6);
    console.log('news - revisited: done');
  });
  test('categoryNews', async () => {
    const query = await createQuery('categoryNews');
    const variables = {
      category: 'test'
    };
    const {data} = await tester.graphql(query, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.categoryNews).toBeDefined();
    expect(data.categoryNews.length).toBe(1);
    console.log('categoryNews - test - revisited: done');
  });
  test('removeNews', async () => {
    const mutation = await createMutation('removeNews');
    const variables = {
      token: token.substring(7),
      id: news1.id
    };
    const {data} = await tester.graphql(mutation, undefined, undefined, variables);
    expect(data).toBeDefined();
    expect(data.removeNews).toBeDefined();
    expect(data.removeNews.content).toMatch(news1.content);
    console.log('removeNews: done');
  });
});