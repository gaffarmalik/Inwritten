
import React from 'react';
import '../../Resources/styles/article.scss';
import { Button, Icon, Form, Modal, Grid, Select, Input } from 'semantic-ui-react';
import Connection from '../../Controllers/auth.controller';

import { withRouter } from 'react-router';
import { BrowserRouter as Router, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FetchArticles from '../../Controllers/article.controller';



function HoverableDiv(props) {

    return (
        <div className='image-thumbnail-template-cover-big'>

            {props.children}

            <div className='template-thumbnail-hover-big'>
                <h2 style={{ marginTop: '0px', padding: '0px' }}>{props.type}</h2>

                <div size='large' style={{ marginTop: '100px', float: 'right' }}>
                    <Button.Group size='small' color='teal' secondary >
                        <Button icon='edit outline' as={Link} to={{ pathname: '/edit-post', state: { editState: props.id } }} />
                        <Button icon='external alternate' as={Link} to={`http://localhost:5000/${props.username}/${props.name}`} />
                        <Button icon='trash alternate outline' />
                        <Button icon='info' />

                    </Button.Group>
                </div>
            </div>

        </div>
    )
}





function date_to_string(date) {
    var fulldate = new Date(date);
    var month = getmonthName(fulldate.getMonth());
    var year = fulldate.getFullYear();
    var day = fulldate.getDate();
    var convert = `${day}- ${month}`;
    return convert;
}


/*
*
*                             GET MONTH NAME
*
*/
function getmonthName(number) {
    var months = [
        '01', '02', '03', '04', '05', '06',
        '07',
        '08',
        '09', '10', '11', '12'
    ]
    return months[number];

}

class PostArchive extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            activeBar: this.props.active,
            visible: false,
            activeAccordion: 0,
            open: false,
            deleteArticleId: null,
            deleteArticleName: null,
            deleteStatus: 'Delete',
            deleteColor: 'red',
            messageDismiss: false,
            username: '',
            email: '',
            search_criteria: 'title',
            arrange_criteria: 'date-asc',
            search: '',
            filter_privacy: [],
            filter_privacy_const: [],
            not_found: false
        }
        this.search_with_criteria = this.search_with_criteria.bind(this);

        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.handleSearchCriteria = this.handleSearchCriteria.bind(this);
        this.showModal = this.showModal.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.handleMessageDismiss = this.handleMessageDismiss.bind(this);
    }


    showModal = (e, p) => {
        var { title, id } = p;
        this.setState(
            {
                open: true,
                deleteArticleName: title.toLowerCase(),
                deleteArticleId: id,
            }

        );



    }
    handleSearchCriteria(e, p) {

        this.setState({ not_found: false, search_criteria: p.value })
    }




    deletePost = () => {
        var id = this.state.deleteArticleId;

        var __delete = new FetchArticles;
        __delete.delete_article(id)
            .then((fulfilled, unfulfilled) => {
                if (fulfilled) {

                    this.props.dispatch(
                        {
                            type: 'DELETE', payload: { _id: this.state.deleteArticleId }
                        });
                    var filter_privacy = this.props.ArticleReducer.filter(nor => nor.public == false);


                    this.setState({ deleteArticleId: null, open: false, messageDismiss: true, filter_privacy: filter_privacy });


                }
                else {
                    this.setState({ deleteArticleId: null });
                }
            })

    }
    focusOnId = (elem) => { document.getElementById(elem).focus() }

    dontDeletePost = () => {

        this.setState({ open: !this.state.open, deleteArticleId: null });
    }


    handleMessageDismiss() {
        this.setState({ messageDismiss: false });
    }

    close = () => this.setState({ open: false })


    connect = new Connection();
    fetchArticle = new FetchArticles();

    onChangeSearch = (e) => { this.setState({ search: e.target.value, not_found: false }) }

    search_with_criteria = (/*scope*/) => {

        var SC = this.state.search_criteria;
        this.setState({ not_found: false });
        var search = this.state.search;

        var ask = this.state.filter_privacy.filter(function (portion, index) {
            return portion[SC].toLowerCase().indexOf(search.toLowerCase()) != -1;
        })

        if (ask.length == 0) this.setState({ not_found: true }, () => { this.focusOnId('search') })
        else if (search.length == 0) {
            this.setState({ filter_privacy: this.state.filter_privacy_const }, () => { this.focusOnId('search') })

        }
        else {

            this.setState({ filter_privacy: ask }, () => { this.focusOnId('search') })


        }



    }


    shouldComponentUpdate(nextProps, nextState) {

        /*FUTURE UPDATES
        */
        return true;


        //return true;
    }

    componentDidMount() {

        var filter_privacy = this.props.ArticleReducer.filter((nor) => nor.public == false);
        this.setState({ filter_privacy });
        this.state.filter_privacy_const = filter_privacy;

    }

    categoryOptions = [
        {
            key: 1,
            value: 'title',
            text: 'By Title',

        },
        {
            key: 2,
            value: 'category',
            text: 'By Category'
        },

    ]

    arrangeOptions = [
        {
            key: 3,
            value: 'date-asc',
            text: 'By Date (old to new)'
        },
        {
            key: 4,
            value: 'date-desc',
            text: 'By Date (new to old)'
        }
        ,
        {
            key: 5,
            value: 'box',
            text: 'By boxes (highest to lowest )'
        },
        {
            key: 6,
            value: 'box',
            text: 'By box (lowest to highest)'
        },
        {
            key: 7,
            value: 'alphabets',
            text: 'By Alphabets'
        }

    ]
    render() {

        var { filter_privacy } = this.state;


        if (filter_privacy.length == 0) {
            return (<div>


                <div className='bodyArticle'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column style={{ padding: '2px' }} computer={13} mobile={16} tablet={8}  >


                                You don't have any draft left. You can create one <Button as={Link} to="/add-post">here</Button>

                            </Grid.Column>


                            <Grid.Column style={{ padding: '5px' }} computer={3} mobile={16} tablet={8}  >






                            </Grid.Column>

                        </Grid.Row>
                    </Grid>


                </div>

            </div>

            )

        }


        else {
            return (

                <div>

                    <Modal dimmer={true} size='mini' open={this.state.open}  >

                        <Modal.Content style={{ height: '200px', background: "", color: 'black', padding: '10%' }}  >
                            <p style={{ textAlign: 'center' }}> <Icon size='big' name='trash' />
                                <h3 >{`Delete -${this.state.deleteArticleName} ?`}  </h3>
                                <br />
                                <Button.Group size='small'  >
                                    <Button onClick={this.dontDeletePost.bind(this)} icon='close' labelPosition='right' content='Close' size='tiny' />
                                    <Button color='red' icon='trash alternate outline' labelPosition='right' content='Delete' size='tiny' onClick={this.deletePost.bind(this, [this.state.deleteArticleId])} />
                                </Button.Group>
                            </p>


                        </Modal.Content>
                    </Modal>

                    <div className='bodyArticle'>

                        <Grid>
                            <Grid.Row >
                            <Grid.Column computer={13} mobile={16} tablet={15}  >     


                                    <div >
                                        <Form size="small" >  

                                            <Input id='search' className='custom-input' style={{background:"yellow"}} name='title' maxLength='50'  value={this.state.search} onChange= {this.onChangeSearch}  placeholder='Search Drafts' />

                                            <Select name='category' style={{border:"none"}} value={this.state.search_criteria} onChange={this.handleSearchCriteria} options={this.categoryOptions} />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <Button primary icon="search" onClick={this.search_with_criteria}/>

                                        </Form>
                                        <br />


                                    </div>



                                </Grid.Column>

                                <Grid.Column computer={16} mobile={16} tablet={15}  >

                                {this.state.not_found == true ? <div className='error-notification'> No {this.state.search_criteria} similar to <b> {this.state.search}</b> was found</div> : ''}

                                    {filter_privacy.map((e) => {
             if(e.featured_image == undefined  || e.featured_image =="" ){
                return (
                    <div key={e._id} className='image-thumbnail-template-cover-big'>

                        <div style={{ margin: '10px 3px' }}>

                            <div className={'customCard-' + e.category} >

                                <div className='customCard-inner' >
                                    <span>Title </span>
                                    <h4 style={{ marginTop: '0px', padding: '0px', textOverflow: 'ellipsis', height: '30%' }}>
                                        {e.title}
                                    </h4>

                                    <span><b>created on </b> </span>
                                    <p>{date_to_string(e.createdAt)}</p>

                                </div>

                            </div>
                        </div>


                        <div className='template-thumbnail-hover-big'>

                                <div className="category">
                                    <span><b>About</b> </span>
                                    <p>{e.description} </p>


                                <Button.Group className="button-hover" size='small' color='teal' secondary >
                                    <Button icon='edit outline' as={Link} to={{ pathname: '/edit-post/' + e._id }} />
                                    <Button icon='external alternate' target="__blank" as={Link} to={`${e.post_link}`} disabled= { true } />
                                    <Button icon='trash alternate outline' title={e.title} id={e._id} onClick={this.showModal} />
                                    <Button icon='comments' as={Link} to={`/comments/${e._id}`} />

                                </Button.Group>

                            </div>
                        </div>

                    </div>



                )

            }

            else
            console.log("Shown this", e.featured_image)
            return (
                <div key={e._id} className='image-thumbnail-template-cover-big'>

                    <div style={{ margin: '10px 3px' }}>

                        <div className={'customCard-' + e.category} style={{backgroundImage: `url('${e.featured_image}')`, backgroundSize:"cover", backgroundPosition:"bottom right"}}>

                            {/*<div className='customCard-inner'  >
                                <span style={{}}>Title </span>
                                <h4 style={{ marginTop: '0px', padding: '0px', textOverflow: 'ellipsis', height: '30%' }}>
                                    {e.title}
                                </h4>

                                <span><b>Created On </b> </span>
                                <p>{date_to_string(e.createdAt)}</p>

            </div>*/}

                        </div>
                    </div>


                    <div className='template-thumbnail-hover-big'>

                        <div style={{}}>
                            <div className="category">
                                <span><b>Title</b> </span>
                                <h3>{e.title} </h3>


                                <Button.Group className="button-hover" size='small' color='teal' secondary >
                                    <Button icon='edit outline' as={Link} to={{ pathname: '/edit-post/' + e._id }} />
                                    <Button icon='external alternate' target="__blank" as={Link} to={`${e.post_link}`}  />
                                    <Button icon='trash alternate outline' title={e.title} id={e._id} onClick={this.showModal} />
                                    <Button icon='comments' as={Link} to={`/comments/${e._id}`} />

                                </Button.Group>
                            </div>

                        </div>
                    </div>

                </div>



            )

                                    })}
                                </Grid.Column>


                            </Grid.Row>
                        </Grid>
                    </div>




                </div>

            )



        }

    }









}

const mapStateToProps = (state) => {
    return state;
}





export default withRouter(connect(mapStateToProps)(PostArchive));
