const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    designation: { type: GraphQLString },
    salary: { type: GraphQLFloat },
    department: { type: GraphQLString },
    profilePicture: { type: GraphQLString }
  })
});

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve() {
        return Employee.find();
      }
    },
    employee: {
      type: EmployeeType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Employee.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: AuthType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(args.password, 10);

        const user = await User.create({
          username: args.username,
          email: args.email,
          password: hashedPassword
        });

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return { token, user };
      }
    },

    login: {
      type: AuthType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const user = await User.findOne({ email: args.email });
        if (!user) throw new Error('User not found');

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) throw new Error('Invalid password');

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return { token, user };
      }
    },

    addEmployee: {
      type: EmployeeType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        department: { type: GraphQLString },
        profilePicture: { type: GraphQLString }
      },
      resolve(_, args) {
        return Employee.create(args);
      }
    },

    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        department: { type: GraphQLString },
        profilePicture: { type: GraphQLString }
      },
      resolve(_, args) {
        const { id, ...updates } = args;
        return Employee.findByIdAndUpdate(id, updates, { new: true });
      }
    },

    deleteEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        return Employee.findByIdAndDelete(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});