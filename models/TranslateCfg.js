const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    user_id: { type: String, required: true },
    channel_id: { type: String, required: true },
    guild_id: { type: String, required: true },
    user_tag: { type: String },
    enabled: { type: Boolean, default: false },
    langs: { type: [String] }
})

module.exports = model('TranslateCfg', schema)