var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var todoSchema = new mongoose.Schema({
  name: String,
  priority: String,
  completed: Boolean
});


var locationSchema = new mongoose.Schema({
  name: String,
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  dateCreated: Date
});

var auditTrailSchema = new mongoose.Schema({
  name: String,
  data: String,
  type : String,
  date: Date,
  ipAddress: String,
  createdBy: String
});

var requestsAndLeaveSchema = new mongoose.Schema({
  dataStart: String,
  dateEnd : String,
  days : [{type: mongoose.Schema.Types.ObjectId, ref: 'dayOff'}],
});

var dayOffSchema = new mongoose.Schema({
  date: Date,
  type: String,
  cost: Number,
  halfDayAM : Boolean,
  halfDayPM : Boolean
});


var workCycleSchema = new mongoose.Schema({
  name: String,
  commencementDate: String,
  day: [{type: mongoose.Schema.Types.ObjectId, ref: 'workDaySchema'}],
});

var workDaySchema = new mongoose.Schema({
  dayOfWeek: String,
  from: Number,
  to: Number
});

var nodeSchema = new mongoose.Schema({
  name: String,
  owner: {
    email: String,
    name: String,
    picture: String,
  },
  collaborators: [{
    name: String,
    email: String,
    picture: String,
    accepted: Boolean,
  }],
  todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'ToDo'}],
  nodes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}],
});

var userSchema = new mongoose.Schema({
  allowanceLeft: Number,
  dateOfBirth: Date,
  email: { type: String, unique: true},
  facebook: String,
  firstName: String,
  google: String,
  invitations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}],
  isNewUser: Boolean,
  jobTitle: String,
  joinDate: String,
  lastName: String,
  username: String,
  nodes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}],
  password: String,
  passwordResetExpires: Date,
  passwordResetToken: String,
  picture: String,
  primaryColor : String,
  requestsAndLeave: [{type: mongoose.Schema.Types.ObjectId, ref: 'requestsAndLeave'}],
  site: String,
  supervisor: String,
  twitter: String,
  type: String,
  vk: String,
  yearlyAllowance: Number

}, schemaOptions);


var autoPopulateNodeSchema = function(next) {
  this.populate('nodes');
  this.populate('todos');
  next();
};

var autoPopulateUserSchema = function(next) {
  this.populate('nodes');
  this.populate('invitations');
  next();
};

nodeSchema
    .pre('findOne', autoPopulateNodeSchema)
    .pre('find', autoPopulateNodeSchema);

userSchema
    .pre('findOne', autoPopulateUserSchema)
    .pre('find', autoPopulateUserSchema)
    .pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

var Node = mongoose.model('Node', nodeSchema);
var ToDo = mongoose.model('ToDo', todoSchema);
var User = mongoose.model('AuditTrail', auditTrailSchema);
var User = mongoose.model('DayOff', dayOffSchema);
var User = mongoose.model('RequestsAndLeave', requestsAndLeaveSchema);
var User = mongoose.model('User', userSchema);
var User = mongoose.model('WorkCycle', workCycleSchema);
var User = mongoose.model('WorkDay', workDaySchema);

module.exports = {
  User : User, Node : Node, ToDo : ToDo
};
