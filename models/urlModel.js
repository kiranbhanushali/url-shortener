let mongo = require("mongodb");
let mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true ,  useUnifiedTopology: true  });

mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;

var urlSchema = new Schema({
    original_url: String,
    short_url: String,
    count: {type:Number,default:0}
});

urlSchema.methods.validateOriginalUrl = function(){

    let url;
    try {
        url = new URL(this.original_url);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";

}

urlSchema.methods.checkShort_url = function(){
    if( this.short_url === '' ) {
        var result = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 6; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 6));
        
        }
            this.short_url = result;

    }

}

var Url = mongoose.model("Url", urlSchema);


module.exports = Url;


