import React from 'react';
import '../../Resources/styles/profile.scss';
import { Icon, Form, Input, Divider, Button, Loader, ButtonGroup, Tab, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import Connection from '../../Controllers/auth.controller';
import { connect } from 'react-redux';
import ProfileUpdate from '../../Controllers/profile.controller';
import Countries from './country';
import validateProfile from "../../Controllers/validators/profile.validator"



function DimmerLoad(props) {
    return <Loader active={props.active} size={props.size} inline />

}




class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            mobile_number: '',
            first_name: '',
            last_name: '',
            profile_photo: "src\img\background.jpg",
            update_success: '',
            update_header: '',
            update_content: '',
            update_color: '',
            old_password: '',
            new_password: '',
            confirm_password: '',
            bio: '',
            social_facebook: "",
            social_instagram: "",
            social_linkedin: "",
            social_whatsapp: "",
            social_youtube:"",


            validationMessage: '',
            buttonDisabled: false,
            dimmerLoad: false,
            validationClass: '',
            //passwordDisabled: true,
            dispPass: "none",
            dispProf: "block",
            dispSoc:"none",
            country:"",
            gender:""



        }
     
    }



    connect = new Connection();
    componentDidMount() {



        let auth_token = localStorage.getItem("hs_token");
       //fetch user data
        this.connect.isLoggedin(auth_token)
            .then( user => {
                this.setState({
                    isLoggedin: true,
                    username: user.username,
                    email: user.email,
                    profile_photo: user.display_picture,
                    mobile_number: user.telephone == null? " ": user.telephone,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    bio: user.bio,
                    gender:user.gender,
                    country: user.country
                })

                //this.setState({...this.props.ProfileReducer});

            })
            .catch( _ => this.props.history.replace('/login'))


            //Then, fetch social media links
            var fetch_socials = new ProfileUpdate()
            fetch_socials.fetchSocials()
            .then(data => {
               // console.log(data, "isnull ooooo")
                if(data.data == null){
                    this.setState({
                        social_facebook: "",
                        social_linkedin: "",
                        social_instagram: "",
                        social_whatsapp: "",
                        social_youtube: ""
                    })   
                }
                else{
                    var { facebook_link, linkedin_link, whatsapp_link, youtube_link, instagram_link } = data.data;
                    this.setState({
                        social_facebook: facebook_link,
                        social_linkedin: linkedin_link,
                        social_instagram: instagram_link,
                        social_whatsapp: whatsapp_link,
                        social_youtube: youtube_link
                    })

                }



               
            })



    }



    handle_bio = (ev) => this.setState({ bio: ev.target.value }) 

    handle_old_password= (ev) => this.setState({ old_password: ev.target.value });

    handle_new_password= (ev) => this.setState({ new_password: ev.target.value });

    handle_confirm_password = (ev) => this.setState({ confirm_password: ev.target.value });

    
    readFile(doc) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();

            reader.readAsDataURL(doc);

            reader.onloadend = function () {
                resolve(reader.result);
            }
        })

    }




    handle_profile_photo =(ev) => {
        this.readFile(ev.target.files[0]).then( result => {
            this.setState({ profile_photo: result })
        })



    }

    handle_email = (ev)=> this.setState({ email: ev.target.value })

    handle_first_name= (ev)=> this.setState({ first_name: ev.target.value });
    

    handle_last_name= (ev) => this.setState({ last_name: ev.target.value });

    handle_username = (ev) => this.setState({ username: ev.target.value });
    
    handle_mobile_number=(ev) => this.setState({ mobile_number: ev.target.value });
    handle_gender =(ev) => this.setState({gender: ev.target.value})
    handle_country = (ev) => this.setState({country: ev.target.value})



    handle_social = (ev) =>{
        var { name, value} = ev.target;
            switch(name){
                case "facebook":
                this.setState({social_facebook: value})
                break;
                case "whatsapp":
                this.setState({social_whatsapp: value})
                break;
                case "linkedin":
                this.setState({social_linkedin: value})
                break;
                case "instagram":
                this.setState({social_instagram: value})
                break;
                case "youtube":
                this.setState({social_youtube: value})
                break;
                
            }
    }



    toggleDialog() {
        var photo = document.getElementById('photo');
        photo.click();
    }

    




    //update profile
    updateProfileButton(e) {
        e.preventDefault();
        var validate_class = new validateProfile();
        var update_profile = new ProfileUpdate()
        let { username, last_name, mobile_number, bio } = this.state;
        this.setState({ dimmerLoad: true, buttonDisabled: true })


        let { error } = validate_class.validate( username, last_name, mobile_number, bio )

        if (error) {
            console.log(error.details)
            this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: `INVALID: ${error.details[0].message}`, validationClass: 'error-bar' });
            this.state.validationClass = this.state.validationMessage = '';
        }

        

        else {

            this.state.validationClass = this.state.validationMessage = '';
            var updateItems = {
                firstName: this.state.first_name,
                lastName: this.state.last_name,
                telephone: this.state.mobile_number,
                email: this.state.email,
                bio: this.state.bio,
                profile_photo: this.state.profile_photo,
                username: this.state.username,
                gender: this.state.gender,
                country: this.state.country
            }


            update_profile.updateProfile(updateItems)
                .then( data => {
                    //update store also

                    this.props.dispatch({ type: 'INJECT_PROFILE', payload:{
                        username: this.state.username,
                        email: this.state.email,
                        display_picture : this.state.profile_photo,
                        telephone: this.state.mobile_number,
                        first_name: this.state.firstName,
                        last_name: this.state.lastName,
                        bio: this.state.bio,
                        gender:this.state.gender,
                        country: this.state.country

                    }  })

                    this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage:  data.message, validationClass: 'success-bar' });
                })
                .catch( err => {

                    if (err.code == 400 ||500) {
                        this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: err.message, validationClass: 'error-bar' });

                    }
                 

                });



        }



    }



    //update password 
    updatePasswordButton(e) {
        e.preventDefault();

        this.setState({ dimmerLoad: true, buttonDisabled: true });


        var controller = new ProfileUpdate();


        if (this.state.new_password.length == 0 || this.state.old_password.length == 0 || this.state.confirm_password.length == 0) {
            this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: 'None of the password field should be left empty', validationClass: 'error-bar' });

            this.state.validationClass = this.state.validationMessage = '';
        }
        else if ((this.state.new_password.length < 6) || (this.state.old_password.length < 6)) {
            this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: 'Password length is too short minimum of 6 characters', validationClass: 'error-bar' });

            this.state.validationClass = this.state.validationMessage = '';
        }
        else if (this.state.new_password !== this.state.confirm_password) {
            this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: 'Sorry, you have a password mismatch', validationClass: 'error-bar' });

            this.state.validationClass = this.state.validationMessage = '';
        }

        else {

            this.state.validationClass = this.state.validationMessage = '';
            var updateItems = {

                username: this.state.username,
                old_password: this.state.old_password,
                new_password: this.state.new_password,
                confirm_password: this.state.confirm_password
            }


            controller.update_password(updateItems)
                .then( success=> {
                    this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: success.message, validationClass: 'success-bar' });
                })
                .catch( err => {
                    if (err.status == "false") {
                        this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: err.message, validationClass: 'error-bar' });

                    }
                    else {
                        this.setState({ dimmerLoad: false, buttonDisabled: false, validationMessage: err.message, validationClass: 'error-bar' });
                    }

                });

        }



    }


//update socials
updateSocialButton(e){
e.preventDefault()
var controller = new ProfileUpdate()
let {social_facebook, social_instagram, social_linkedin, social_whatsapp, social_youtube} = this.state;

var data ={
    facebook_link: social_facebook,
    youtube_link:social_youtube,
    instagram_link: social_instagram,
    linkedin_link:social_linkedin,
    whatsapp_link: social_whatsapp,
}

controller.updateSocials(data)
.then(saved =>{
    if(saved.code == 200){
        this.setState({
            validationMessage:"Social Media added successfully!",
            validationClass:"success-bar"
        })
    } 
    else {
        this.setState({
            validationMessage:"Soemthing went wrong. We'll fix it",
            validationClass:"error-bar"
        })
    }
})
}


    swapSettings(e) {

        switch(e.target.id){
            case "password":
            if (this.state.dispPass == "block");
            else if (this.state.dispPass == "none") { this.setState({ dispPass: "block", dispProf: "none", dispSoc:"none" }) }
            break;

            case "profile":
            if (this.state.dispProf == "block");
            else if (this.state.dispProf == "none") { this.setState({ dispProf: "block", dispPass: "none", dispSoc:'none' })  }
            break;

            case "socials":
            if (this.state.dispSoc == "block");
            else if (this.state.dispSoc == "none") { this.setState({ dispSoc:"block", dispProf: "none", dispPass: "none" })  }
            break;
        }
    


    }
   


    render() {

        var { email, username, bio, mobile_number, first_name, last_name } = this.state;
        let fullname = first_name !="" ? `${first_name} ${last_name}`: "Update your Names"
        var bio = bio !="" ? bio :` - `
        var username = username !="" ? username :` - `
        var mobile_number = mobile_number !="" ? mobile_number :` - `;


        const panes = [
            {
              menuItem: 'Profile',
              render: () => <Tab.Pane attached={false}>
              <div className="data-info-profile" >
                            <h3 style={{ padding: '5px', color:"black" }}> Profile</h3>
                        
                          
                            {this.state.validationClass == "success-bar" ? <p style={{  margin:"15px auto" }}><Icon name="check circle outline" color="green" size="big" /> <span style={{color:"black"}}> {this.state.validationMessage} </span></p>: ""} 
                            {this.state.validationClass == "error-bar" ? <p style={{  margin:"15px auto" }} ><Icon name="cross" color="red" size="big" /> <span style={{color:"black"}}> {this.state.validationMessage} </span></p> :"" }
                    
                    
                    
                            <Form size="small" style={{ width: '100%' }} id='formUpdate1'>
                    
                                <Form.Group widths='equal'>
                                    <Form.Field label='Email' value={this.state.email} control='input' placeholder='Email' onChange={this.handle_email} disabled required type='email' pattern={/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/} />
                                    <Form.Field label='Username' control='input' placeholder='Username' value={this.state.username} onChange={this.handle_username} name='username' id='username' type='text' required />
                                </Form.Group>
                    
                                <Form.Group widths='equal'>
                                    <Form.Field label='Firstname' value={this.state.first_name} control='input' placeholder='Firstname' onChange={this.handle_first_name} />
                                    <Form.Field label='Lastname' control='input' placeholder='Lastname' value={this.state.last_name} onChange={this.handle_last_name} />
                                </Form.Group>
                    
                                <span style={{color:"black"}}>Country</span>
                    
                                <Countries handleChange={this.handle_country} value={this.state.country} />
                                <br></br>
                                
                                <span style={{color:"black"}}>Gender</span>
                                <select onChange={  this.handle_gender } value={this.state.gender} >
                                    <option value="none">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <br></br>
                                <Form.Group widths='equal'>
                                <Form.Field id='bio' label='Bio (Write something...)' control='textarea' value={this.state.bio} onChange={this.handle_bio} minLength='20' maxLength='150' name='bio' />
                                <Form.Field id='number' label='Mobile Number' control='input' type='tel' value={this.state.mobile_number} onChange={this.handle_mobile_number} minLength='11' maxLength='14' name='number' />
                                </Form.Group>
                    
                                <Button type='submit' secondary color='teal' disabled={this.state.buttonDisabled} size='small' floated='right' onClick={this.updateProfileButton.bind(this)}>
                                    Update Profile <DimmerLoad size="small" active={this.state.dimmerLoad} />
                                </Button>
                            </Form>
                    </div>
            
            
            
            </Tab.Pane>,
            },
            {
              menuItem: 'Passwords',
              render: () => <Tab.Pane attached={false}>

              <div className="data-info-password"  >
                  <h3 style={{ padding: '5px', color:'black' }}> Passwords</h3>

                 {this.state.validationClass == "success-bar" ? <p style={{  margin:"15px auto" }}><Icon name="check circle outline" color="green" size="big" /> <span style={{color:"black"}}> {this.state.validationMessage} </span></p>: ""} 
              {this.state.validationClass == "error-bar" ? <p style={{  margin:"15px auto" }} ><Icon name="cross" color="red" size="big" /> <span style={{color:"black"}}> {this.state.validationMessage} </span></p> :"" }

                            <Form size="small" style={{ width: '100%' }} id='formUpdate1'>

                      <Form.Field label='Old Password ' control='input' type='password' placeholder='Old password' minLength='6' value={this.state.old_password} onChange={this.handle_old_password} />

                      <Form.Field label='New Password' control='input' type='password' placeholder='New password' minLength='6' value={this.state.new_password} onChange={this.handle_new_password} />
                      <Form.Field label='Confirm New Password' control='input' type='password' placeholder='Confirm New password' value={this.state.confirm_password} onChange={this.handle_confirm_password} />


                      <Button type='submit' secondary color='teal'  disabled={this.state.buttonDisabled} size='small' floated='right' onClick={this.updatePasswordButton.bind(this)}>
                          Update Password <DimmerLoad size="small" active={this.state.dimmerLoad} />
                      </Button>
                  </Form>

              </div> 

</Tab.Pane>,
            },
            {
              menuItem: 'Socials',
              render: () => <Tab.Pane attached={false}>


              <div className="data-info-socials" >
                  <h3 style={{ padding: '5px', color:'black' }}> Socials</h3>

                 
                  {this.state.validationClass == "success-bar" ? <p style={{  margin:"15px auto" }}><Icon name="check circle outline" color="green" size="big" /> <span style={{color:"black"}}> {this.state.validationMessage} </span></p>: ""} 
                 {this.state.validationClass == "error-bar" ? <p style={{  margin:"15px auto" }} ><Icon name="cross" color="red" size="big" /> <span style={{color:"black"}}> {this.state.validationMessage} </span></p> :"" }

                            <Form size="small" style={{ width: '100%' }} id='formUpdate1'>

                      <Divider />
                      <p style={{color:"black"}}> Socials allow your readers connect to you on other popular platforms. </p>

                      <Form.Field label= "Facebook" control='input' name='facebook' placeholder='Your facebook URL' minLength='6' value={this.state.social_facebook} onChange={this.handle_social} />
                      <Form.Field label="Whatsapp Chat" control='input' name="whatsapp"  placeholder='Your Whatsapp URL' minLength='6' value={this.state.social_whatsapp} onChange={this.handle_social} />
                      <Form.Field label='LinkedIn' control='input' name="linkedin" placeholder='Your LinkedIn URL' value={this.state.social_linkedin} onChange={this.handle_social} />
                      <Form.Field label='Instagram' control='input' name="instagram" placeholder='Your Instagram URL' value={this.state.social_instagram} onChange={this.handle_social} />
                      <Form.Field label='Youtube Channel' control='input' name="youtube" placeholder='Link to your Yotube Channel' value={this.state.social_youtube} onChange={this.handle_social} />

                     
                      <Button type='submit' secondary color='teal'  disabled={this.state.buttonDisabled} size='small' floated='right' onClick={this.updateSocialButton.bind(this)}>
                          Update Socials <DimmerLoad size="small" active={this.state.dimmerLoad} />
                      </Button>
                  </Form>



              </div> </Tab.Pane>,
            },
          ]
          
          
     







     
        return (
<Container>
            <div className="profile-div" style={{marginTop:"0px !important"}}>


                <div className='profile-header'>
                    <div className="profile-pix-block">
                        <img src={this.state.profile_photo} className="profile-pix" id='profile_photo' />
                        <input className="profile-pix-cover" onChange={this.handle_profile_photo} type='file' placeholder='Mobile Number' id='photo' style={{ visibility: 'hidden' }} />
                        <div className="profile-pix-cover" onClick={this.toggleDialog.bind(this)}></div>
                    </div>

                    <div className="profile-primary-info">
                        <h2 style={{ color: 'black' }}> {fullname} </h2>
                        <div className='span-details'>Username</div> <span> @{username} </span><br></br>
                        <div className='span-details'>Email</div><span> {email}</span><br></br>

                    </div>
                </div>
              


                <div className="profile-body">
 


               <Tab
    menu={{ secondary: true, pointing: true }}
    panes={panes} />





                </div>






            </div>
            </Container>
        )


    }






}

const mapStateToProps = (state) => {
    return state;
}

export default withRouter(connect(mapStateToProps)(Profile));






