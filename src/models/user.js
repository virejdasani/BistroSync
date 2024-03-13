const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
    name: {
        type: String,
        require: [true, 'Name cannot be blank']
    },
    email: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        default: null
    },
    admin: {
        type: Boolean,
        required: true
    }
});

userSchema
.virtual('url')
.get(function() {
    return '/main/user/'+this._id;
});

userSchema.statics.validate = async function(username, password) {
    const foundUser = await this.findOne({username});
    if (!foundUser) {
        return false;
    } else {
        const isValid = await bcrypt.compare(password, foundUser.password);
        return isValid ? foundUser : false;
    }
}

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema);
