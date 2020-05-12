const { Schema, model } = require('mongoose')

const schema = new Schema({
    code: { type: String, required: true, unique: true },
    title: { type: String }
})

module.exports = model('Lang', schema)