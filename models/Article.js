var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	headline: {
		type: String,
		unique: true,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;