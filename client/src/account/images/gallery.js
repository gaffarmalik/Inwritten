
/*
*
*           IMPORTS
*
*/

import React, { /*Component*/ } from 'react';
import {Button,  Form, Checkbox,  Header, Loader, Dropdown,  Icon,  Select, Grid } from 'semantic-ui-react';
import './images.scss';
import {  withRouter } from 'react-router';
//import { BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import Connection from '../../../controllers/auth';

import { connect } from 'react-redux';
import HeaderAccount from '../header_account';
import FetchArticles from '../../../controllers/articleController' 


function DimmerLoad(props){
  return  <Loader active ={props.active} size={props.size} inline />
  
}

function HoverableDiv (props){
  return (
  <div className='image-thumbnail-template-cover'>

 {props.children}

 <div className='template-thumbnail-hover'> <h5>{props.name} </h5>
 <h6>{props.type}</h6>
 </div>
  
  </div>
  ) 
}



class Gallery extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      buttonDisabled:false,
      dimmerLoad:false,
      ERROR_MESSAGE: '',
      SUCCESS_MESSAGE: '',
      privacy_value: false,
      enable_comments: true,
      post_title: '',
      featured_image:'',
      createdAt: Date.now(),

      post_category: 'all',
      post_description: '',
      time_to_read: 5 ,
      body: ''
    
    }

   
    this.handlePostprivacy = this.handlePostprivacy.bind(this);
    
    //this.postValidation =this.postValidation.bind(this);
  }
  
/*
*
*           HANDLE CHANGE EVENTS ON INPUTS
*
*/
handleInputs(e, prop= prop || '' ){
  e.preventDefault();
var {name, value} =e.target;

if (prop ==""){
  switch (name){

    case 'title':
    this.setState({ post_title: value });
    break;
    
    case 'time':
    this.setState({ time_to_read: value });
    break;
    
    case 'description':
    this.setState({ post_description: value });
    break;    


  }
}
else{

  switch (prop.name){

    case 'category':
    let category =prop.value;
   
   this.setState({ post_category:category });
   break; 

  }

}

 return null;


}


 
  handlePostprivacy = (e, { value }) => this.setState({ privacy_value: !this.state.privacy_value });
  handleEnableComments = (e, { value }) => this.setState({ enable_comments: !this.state.enable_comments })




  postValidation(title = this.state.post_title, description = this.state.post_description, duration= this.state.time_to_read) {
if(window.editor.length <8) return 'editor-error'
else if (title.length == 0) return 'title-error';
 
else if(duration.length !== 0){
  if( duration >30 ) return "time-error";
  else if( duration < 0 ) return "time-error";
}


else{

  return true;

}

return true;
  }





  addPost() {
    var add = new FetchArticles()
    
this.setState({buttonDisabled:true, dimmerLoad:true});

    var post = {
      title: this.state.post_title.trim(),
      createdAt: Date.now(),
      category: this.state.post_category,
      description: this.state.post_description.trim(),
      time_to_read: this.state.time_to_read,
      comments_enabled: this.state.enable_comments,
      public: this.state.privacy_value,
      body: body,
     
    }

    let val = this.postValidation(this.state.post_title, this.state.post_decription);
//alert val
    if (val=== true) {

      add.create_article(post).then(
        (okay) => {
          this.props.dispatch({type:'INSERT_ARTICLE', payload:post });

        this.setState({ SUCCESS_MESSAGE: 'YOUR ARTICLE HAS BEEN CREATED',
        ERROR_MESSAGE:'',
        buttonDisabled:false, dimmerLoad:false
        }); 
       

        var note =document.getElementsByClassName('notification-background');
        note[0].classList.remove('reverse-anime');

        }


      ).catch(
        (err) => {
          this.setState({buttonDisabled:false, dimmerLoad:false});
          this.setState({ NETWORK_ERROR: `Sorry, there was an error with your article! We would fix this soon` });
        }
        );
    }
    else if(val !== true ) {
      this.setState({buttonDisabled:false, dimmerLoad:false});
    
      this.setState({ ERROR_MESSAGE: val });

    }


  }









  /*
  *
  *           REACTJS LIFECYCLE HOOKS
  *
  */
  connect= new Connection();
  fetchArticle =new FetchArticles();
  
  componentDidMount() {

    if( Object.keys(this.props.ProfileReducer).length ==0 ){
      console.log('empty',  this.props.ArticleReducer);
      
      this.connect.isLoggedin()
      .then((( success )=>{
      
      this.props.dispatch({type:'INJECT_PROFILE', payload:[{
      key:"isLoggedin",
      value:true}
      ,{
          key:"username",
          value:success.ID.username
      },   {
          key:"email",
          value:success.ID.email
          } 
      
      ]
      })
      
      this.fetchArticle.fetch_articles_list().then((articles, none)=>{
      if(articles){
      console.log(articles);
      this.props.dispatch({type:'OVERWRITE_ARTICLE', payload:articles.RESULT});

      
    //check if its in the array
    
    for(var x of this.props.ArticleReducer ){
      if(x._id == this.props.location.state.editState){
 
    this.setState({post_title: x.title, post_description:x.description,
      post_category :x.category,
      privacy_value:x.public,
      enable_comments :x.comments_enabled,
      time_to_read :x.time_to_read,
      body: x.body
    });

      }
    }
      }
      else{
      //error
      this.props.history.replace('/login');
      
      }
      })
      
      
      }))
      .catch(( err )=>{
      this.props.history.replace('/login');
      
      })
      
      
      }
      
      else{
    console.log('full', this.props.ArticleReducer);
   
    for(var x of this.props.ArticleReducer ){
      if(x._id == this.props.location.state.editState){
   console.log(x.body, 'X.BODY IS HERE')
   this.setState({post_title: x.title, post_description:x.description,
      post_category :x.category,
      privacy_value:x.public,
      enable_comments :x.comments_enabled,
      time_to_read :x.time_to_read,
      body: x.body
    }); 
   

      }
    }

            }



  }


  toggleDialogFeatured(){
    var photo = document.getElementById('photo');
    photo.click();
    console.log(photo)
}


readFile(doc) {
  return new Promise((resolve, reject) => {
      var reader = new FileReader();

      reader.readAsDataURL(doc);

      reader.onloadend = function () {
          resolve(reader.result);
      }
  })

}

handle_profile_photo(ev){
  var src;
  var file = document.getElementById('photo');
  this.readFile(ev.target.files[0]).then((result)=>{
  
      //LOL
      this.setState({featured_image:result});
  })
}
  /*
  *
  *          RENDER FILE
  *
  */

  render() {
//INITIAL ARRAY VALUE ==>0 [EMPTY] , THEN LATER POPULATED 
   


    //console.log('From addpost page', this.props.ProfileReducer);
    var privacy_value = (this.state.privacy_value == true) ? 'Publish to the World' : 'Save Save to draft';
    var comment_value = (this.state.enable_comments == true) ? 'Commenting is enabled' : 'Commenting is disabled';
    var template_sample = [
      {
        _name: 'Diana \'s Rose ',
        _category: 'Red',
        _id: 12
      },
      {
        _name: 'Diana \'s Rose ',
        _category: 'Blue',
        _id: 23
      }
      ,
      {
        _name: 'Diana \'s Rose ',
        _category: 'Golden Eaglet',
        _id: 234
      }
    ]

    var categoryOptions=[
      {key:1,
        value:'all',
        text:'Select Category',
        
        },
      {key:2,
      value:'art',
      text:'Art'
      },
      {key:3,
        value:'os',
        text:'Operating Systems (OS)'
        },
        {key:4,
          value:'js',
          text:'Javascript'
          },
          {key:5,
            value:'edu',
            text:'Education'
            },
            {key:6,
              value:'tech',
              text:'Technology'
              },
              {key:7,
                value:'sci',
                text:'Science'
                }
                ,
              {key:8,
                value:'health',
                text:'health'
                }
                ,
              {key:9,
                value:'rom',
                text:'Romance'
                }
    ]

  
      return (

        <HeaderAccount pageTitle={this.props.location.pathname.slice(1)} >
        { /*EDITOR PANEL WIDE*/ }
  
      { /*<EditorPanel/> */}
  
          <div className='add-post'>
            <Grid stackable>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={8} computer={12} style={{ padding: '0px 10px' }} >
                <Header textAlign='left'> <h3>{`Edit "${this.state.post_title}"`} </h3></Header>
            <div className='notification-background'>
                <div style={{ width: '100%', background:'rgba(3, 68, 94,0.8)', color: 'white', padding: '2% 5%' }} >
  
  
  
                  {this.state.SUCCESS_MESSAGE === '' ?
                    <div>
                       <span style={{float:'right', cursor:'pointer'}} onClick={function(){
                         var note =document.getElementsByClassName('notification-background');
                    note[0].classList.add('reverse-anime');
                    
                       }} ><Icon name='close'/> </span>
                      <h3><Icon name='calendar check outline'/>SOME HELPFUL TIPS</h3>
                      <ul style={{ listStyleType: 'square' }} >
                        <li>You might want to observe comments on your articles to guide you better</li>
                        <li>Make every article relevant. Relevancy helps!</li>
                        <li>You may add images to make it attractive</li>
                      </ul>
  
                    </div>
  
                    : <div>
                       <span style={{float:'right', cursor:'pointer'}} onClick={function(){
                         var note =document.getElementsByClassName('notification-background');
                    note[0].style.display= 'none';
                       }} ><Icon name='close'/> </span>
                      <Icon name='check circle outline' color='white' size='big'/>
                       {this.state.SUCCESS_MESSAGE}YOU CAN CHECK THE ARTICLE <a href={'http://localhost:5000/'+this.state.post_title } target='_blank' style={{color:'black'}} ><u>HERE</u> </a>
                    </div>
  
                  }
  
                </div>
  </div>
               {/*   */}
               {
                  this.state.NETWORK_ERROR !== '' ?
                    <p style={{ padding: '5px', color: 'red', width: '90%', borderRadius: '0px' }}>  {this.state.NETWORK_ERROR} </p>
                    : ''
                }
               {
                  this.state.ERROR_MESSAGE == 'editor-error' ?
                    <p style={{ padding: '5px', color: 'red', width: '90%', borderRadius: '0px' }}>  You've not written anything yet! </p>
                    : ''
                }
               



            



           
    <h5>TEMPLATE SETTINGS </h5>
  {/* click to go to template store */}
        <h4 className='image-thumbnail'><a href='/template-store' >  GET MORE FROM THE STORE </a></h4>
  
                {template_sample.map((each) => {
  
                    return (
  <HoverableDiv name={each._name} type={each._category} key={each._id}>
  <img src='src/img/tech.png' className='image-thumbnail-template' /> 
  
  </HoverableDiv>
  
                    )
                  })}
  
  
  
  
  
  
  
              </Grid.Column>
  
              <Grid.Column mobile={16} tablet={8} computer={4}  >
               <div className='editor-side2'>
                <h5>POST SETTINGS</h5>
                <Form size="big">
                <b className='custom-label'> WHAT DESCRIBES YOUR ARTICLE? </b><span style={{float:'right'}} ></span>
                <p> </p>
  
  
                  <Form.Field name='title' maxLength='50' label='Title' value={this.state.post_title} onChange={this.handleInputs.bind(this)} control='input' placeholder='Title' required />
                  {
                  this.state.ERROR_MESSAGE == 'title-error' ?
                    <p style={{color: 'red', width: '90%', borderRadius: '0px' }}> Title is required</p>
                    : ''
                }
                  <Form.Field name='time' maxLength='2' min='0' type="number" value={this.state.time_to_read} control='input' placeholder="How many minutes read?" label='Duration (minutes)' onChange={this.handleInputs.bind(this)}/>
                  {
                  this.state.ERROR_MESSAGE == 'time-error' ?
                    <p style={{  color: 'red', width: '90%', borderRadius: '0px' }}> The duration should not be less than 0 and not greater than 30 </p>
                    : ''
                }
                  <Form.Field name='description' maxLength={70} label='Slug' control='textarea' placeholder='Post Slug' value={this.state.post_description} onChange={this.handleInputs.bind(this)} />
  
                  {
                  this.state.ERROR_MESSAGE == 'description-error' ?
                    <p style={{ color: 'red', width: '90%', borderRadius: '0px' }}>  Description length is small</p>
                    : ''
                }
  
                </Form>
        <br/>
             </div>  
  
                <div className='editor-side1' >
                <b className='custom-label' ><Icon name='options'/> Additionals</b><span style={{float:'right'}} ></span>
                <p>  </p>
                  <p> Configure basic settings for your post like enabling comments, Saving as draft for later, mentioning another author, e.t.c </p>
                  <Form>
  
                
                <Select compact name='category' className='custom-label'  value={this.state.post_category} onChange={this.handleInputs.bind(this)} options={categoryOptions} />
                <br/>
                    <Form.Field>
  
  
                      <Checkbox
                        toggle
                        name='radioGroup1'
                        checked={this.state.privacy_value === true}
                        onChange={this.handlePostprivacy}
                      // label=  { privacy_value }
  
                      />
                      <p>{privacy_value}</p>
                    </Form.Field>
  
  
                    <Form.Field>
  
                      <Checkbox
                      toggle
                        name='radioGroup2'
                        checked={this.state.enable_comments === true}
                        onChange={this.handleEnableComments}
                      //label ={ comment_value}
                      />
                      <p>{comment_value} </p>
                    </Form.Field>
                    <b>Tags for your article</b>
                    <Dropdown search selection multiple allowAdditions />
  
  
                  </Form>
  
                  <h5> Featured Image</h5>
                  <div className="profile-pix-block">
                    <img src={this.state.featured_image} className="featured-image"/>
                    <input className="profile-pix-cover" onChange={this.handle_profile_photo.bind(this)}
                      type='file' placeholder='Mobile Number' id='photo' style={{visibility:'hidden'}} />
  
                    <div className="profile-pix-cover" onClick={this.toggleDialogFeatured.bind(this) }>
                    <Icon color="teal" size="big" name='image' /> Upload Featured Image </div>
                    </div>
                
                
                
  
               <div style={{ marginTop:'200px', borderRadius: '0px', position:'relative' }}  >
                <Button disabled={this.state.buttonDisabled} type='submit' size='tiny' color="blue" onClick={this.addPost.bind(this)} >
                <DimmerLoad size='tiny' active={this.state.dimmerLoad} />
                        Update <Icon name='arrow right' />
                </Button>
                </div>
  
                </div>
  
  
                
         
  
  
  
  
               
              </Grid.Column>
              
  </Grid.Row>
  
  
  
            </Grid>
  
  { /*EDITOR PANEL INITIAL */ }
  
  
          </div>
  
        </HeaderAccount>
  
  
  
      )
   
      
    
   


  }
}

var mapStatetoProps = (state) => {
  return state;
}
export default withRouter(connect(mapStatetoProps)(Gallery));