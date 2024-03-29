var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const SCHEME = {

    /*         BLOG POST SCHEMA
    */

    template: new Schema({

        template_name: { type: String, required: true, unique: true },
        template_description: { type: String, default: "No template description", maxlength: 255 },
        file_location: { required: true, type: String },
        featured_image: { type: String },
        showcase_url: { type: String },
        category: { type: String, default: 'all' },
        profile_url: { type: String, required: true },
        blogs_url: { type: String, required: true, lowercase:true },
        index: { type: String, required: true }


    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }),


    /*
             USER PROFILE SCHEMA
    */


    profile: new Schema({
        username: { type: String, lowercase: true, trim: true, required: true, unique: true },
        address: { type: String, trim: true, lowercase: true },
        email: { type: String, lowercase: true, required: true, trim: true, unique: true, index:true },
        password: { type: String, required: true },
        telephone: { type: String },
        lastName: { type: String, trim: true },
        firstName: { type: String, trim: true },
        display_picture: { type: String, default: "/user-icon.png" },

        bio: { type: String },
        verified: { type: Boolean, required: true, default: false },
        lastVerified: { type: Date, default: Date.now() },
        profile_link: { type: String, default: "", lowercase: true },
        country: { type: String, default: "[]" },
        gender: { type: String, default: "" },
        followed_topics: {type:mongoose.Schema.Types.Array, default:[]},

        template_id: {
            type: mongoose.Schema.Types.ObjectId, default: "5e01d951f47d3806c0aa6996",
            ref: "Template"
        },
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
//            unique:true,
            
        }],

    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }),




    /*
               ARTICLES/POST SCHEMA
    */

    posts: new Schema({
 
        title: { type: String, default:"Untitled", lowercase:true },
        body_html: { type: mongoose.Schema.Types.Mixed, required:true },
        body_schema: { type: mongoose.Schema.Types.Mixed, default:null },
        featured_image: { type: String, default:"https://www.inwritten.com/images/preview_featured2.jpg" },
        category: { type: String, default:"unc" },
        // Not needed createdAt: { type: Date, default: Date.now() },


        like_count: { type: Number, default:0 }, //x1.0
        read_count:{type:Number, default:0}, //x0.5
        trend_score:{type:Number, default:0, required:true },

        time_to_read: { type: Number, default:5 },
        comments_enabled: { type: Boolean },
        public: { type: Boolean, default:true },
        author: String, //author email
        description: { type: String, default:"No Description"},
        likes: { Type: mongoose.Schema.Types.Number, default: 0 },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        post_link: { type: String, default: "", lowercase:true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        times_read: { type: Number, default: 0 },
        template_id: { type: mongoose.Schema.Types.ObjectId, default: "5e01d83ff47d3806c0aa6992" },
        tags: {type: String, maxlength: 100, default:" "},
        type:{type:String, enum:["DRAFT", "PUBLISH"], default:"PUBLISH" }


    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }
    ),

 /*
               DRAFTS SCHEMA
    */

   drafts: new Schema({
 
    title: { type: String, default:"Untitled", lowercase:true, },
    body_html: { type: mongoose.Schema.Types.Mixed, required:true },
    body_schema: { type: mongoose.Schema.Types.Mixed, default:null },
    featured_image: { type: String, default:"https://www.inwritten.com/images/preview_featured2.jpg" },
    category: { type: String, lowercase: true, default:"Draft" },
   // Not needed createdAt: { type: Date, default: Date.now() },
    like_count: { type: Number, default:0 },
    read_count:{type:Number, default:0},
    trend_score:{type:Number, default:0, required:true },



    time_to_read: { type: Number, default:5 },
    comments_enabled: { type: Boolean },
    public: { type: Boolean, default:true },
    author: String, //author email
    description: { type: String, default:"No Description"},
    likes: { Type: mongoose.Schema.Types.Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    post_link: { type: String, default: "", lowercase:true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    times_read: { type: Number, default: 0 },
    template_id: { type: mongoose.Schema.Types.ObjectId, default: "5e01d83ff47d3806c0aa6992" },
    tags: {type: String, maxlength: 100, default:" "},
    type:{type:String, enum:["DRAFT", "PUBLISH"], default:"DRAFT" },
    published:{type:Boolean, default:false, required:true}


},
    {
        timestamps: true,
        versionKey: false,
        strict: false
    }
),

 
       

    /*
               USER SOCIALS SCHEMA
    */


   socials: new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    facebook_link: { type:String, default:"https://www.facebook.com/inwritten" },
    linkedin_link: { type: String, default: "https://www.linkedin.com/company/42405525/admin/" },
    youtube_link: { type: String, default:"#" },
    whatsapp_link: { type: String, default: "#" },
    instagram_link: { type: String, default:"https://www.instagram.com/inwritten_" }
},
    {
        timestamps: true,
        versionKey: false,
        strict: false
    }
),


  /*
               COMMENTS SCHEMA
    */


    comments: new Schema({
        seen: { type: Boolean, default: false },
        author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        commenter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        likes: { type: Number, default: 0 },
        post_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Post" },
        public: { type: Boolean, default: false },
        comment: { type: String }
    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }
    ),


    /*
        NOTIFICATIONS SCHEMA
        
    */
    notifications: new Schema({
        sender: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
        type: { type: String, enum:["FOLLOW", "LIKE", "COMMENT"], default: 'FOLLOW' },
        reference_data: { type: String, default:"#" },
        note: { type: String, default:'' },
        read: {type:Boolean, default: false}
    
    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }
    ),

     /*
        FOLLOW SCHEMA
        
    */
   follow: new Schema({
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    followee_id: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    feeds:{
        type:mongoose.Schema.Types.Array, default:[],
        
    }
    

},
    {
        timestamps: true,
        versionKey: false,
        strict: false
    }
),







      /*
               PREFERENCES SCHEMA
    */

    preferences: new Schema({
        background: { type: String, default: "white" },
        font_family: { type: String, default: "Times New Roman" }

    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }
    ),



    subscribers: new Schema({
        email: { type: String, maxlength:255, required:true, ref:"User", unique:true },
        ip_address: {type: String,  default:"" },
        country: {type: String,  default:""},
        city: {type: String, default:""},
        ll:{type:mongoose.Schema.Types.Array, default:[]}

    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }
    ),


    //EDITOR'S PICK
    editors_pick: new Schema({
 
        title: { type: String, default:"Untitled", lowercase:true },
        body_schema: { type: mongoose.Schema.Types.Mixed, default:null },
        featured_image: { type: String, default:"https://www.inwritten.com/images/preview_featured2.jpg" },
        category: { type: String, lowercase: true, default:"unc" },
        // Not needed createdAt: { type: Date, default: Date.now() },
        like_count: { type: Number, default:0 },
        read_count:{type:Number, default:0},
        time_to_read: { type: Number, default:5 },
        author: String, //author email
        description: { type: String, default:"No Description"},
        likes: { Type: mongoose.Schema.Types.Number, default: 0 },
        post_link: { type: String, default: "", lowercase:true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },


    },
        {
            timestamps: true,
            versionKey: false,
            strict: false
        }
    ),

}



module.exports = SCHEME;