import React from 'react';

import '../../Resources/styles/account.scss';
import { Button,  Grid, Card, Image, Label, Item, Divider, Dropdown, Loader, Placeholder, Container } from 'semantic-ui-react';
import {  Icon,  Progress } from 'semantic-ui-react';
import Connection from '../../Controllers/auth.controller';
import {  withRouter } from 'react-router';
import { connect } from 'react-redux';
import FetchArticles from '../../Controllers/article.controller';
import DraftPreview from '../Archives/draftpreview';
// import NotificationsPreview from '../Notifications/notifications_preview';
import profileController from "../../Controllers/profile.controller"
import FetchNotifications from "../../Controllers/notifications.controller"
import FetchBlog from "../../Controllers/blog.controller"




class Account extends React.Component {

  constructor(props) {

    super(props)
    this.state = {

        dimmerLoad: true,
        disabled: true,
        notifications:[],
        follower_count:0,
        story_count:0,
        blog:[]
        

      
    }


  }


  connect = new Connection();
  fetchArticle = new FetchArticles();
  fetchBlog = new FetchBlog();

  toggle = () =>this.setState({ visible: false });

  toggleSide = () => this.setState({ visible: !this.state.visible });




async componentDidMount() {
//Lots of fetches to go here...
//Notification Preview
//Stats Counts

try {
  let notifications = new FetchNotifications();
  let stats = new profileController()
  let counts = await stats.fetchStats();
  let blogs = await this.fetchBlog.trending();
  let notif = await notifications.get_notifications(this.props.ProfileReducer._id);


  if (notif.data == null) {
    
    this.setState({blog: blogs, follower_count: counts.data.follower_count, story_count: counts.data.story_count })

  }
  else {
      
      this.setState({ blog: blogs, notifications: notif.data.slice(0,5), follower_count: counts.data.follower_count, story_count: counts.data.story_count })
  }

} catch (err) {
  //catch uncaught server error
  console.log(err, "error")
}

  
  }


  render() {

  
    var imports = {
      Icon: Icon,
      Grid: Grid,
      Image: Image,
      Card: Card,
      Progress: Progress,
      Button: Button,
      Label: Label,
      Item: Item,
      Loader: Loader,
      Dropdown: Dropdown,
      Placeholder:Placeholder
    }




    return (

      <div >

          <div className="bodyArticle">
            <Container>
            <Grid >
            <Grid.Row ><h5 style={{marginLeft:"12px"}}>My Activity </h5></Grid.Row>

              <Grid.Row textAlign="center" columns="3" style={{marginBottom:"20px"}}> 
                <Grid.Column>
                  <p style={{fontSize:"25px"}}>{this.state.follower_count}</p>
                  <p>Follower(s)</p>
                </Grid.Column>
                <Grid.Column >
                  <p style={{fontSize:"25px"}}>{this.state.story_count}</p>
                  <p>Stories</p>
                </Grid.Column>
                <Grid.Column>
                  <p style={{fontSize:"25px"}}>{this.props.ProfileReducer.bookmarks.length}</p>
                  <p>Bookmarks</p>
                </Grid.Column>
              </Grid.Row>
              <Divider />

              <Grid.Row ><h5 style={{marginLeft:"12px"}}>Editors' Pick </h5>
              
              </Grid.Row>
              <DraftPreview data={ this.state.blog } imports={imports} />

              <Divider />

              {/* <Grid.Row  style={{paddingLeft:"12px"}}>
              <h3>My Circle </h3>
              </Grid.Row>
              <DraftPreview data={ this.state.blog } imports={imports} />

              <Divider /> */}

              <Grid.Row ><h5 style={{marginLeft:"12px"}}>Trending Stories </h5></Grid.Row>
              <DraftPreview data={ this.state.blog } imports={imports} />

              <Divider />

              <Grid.Row ><h5 style={{marginLeft:"12px"}}>Following based on Topics </h5></Grid.Row>
              <DraftPreview data={ this.state.blog } imports={imports} />

              <Grid.Row ><h5 style={{marginLeft:"12px"}}>Writer's you follow </h5></Grid.Row>
              <DraftPreview data={ this.state.blog } imports={imports} />


              {/* <Grid.Row>
                <NotificationsPreview data={this.state.notifications} />
              </Grid.Row> */}
            
            </Grid>
              
</Container>
          </div>

      </div>



    )
  }
}


const mapStateToProps = (state) => {
  return state;
}


Account.T = {
  state: Object
};
export default withRouter(connect(mapStateToProps)(Account));








