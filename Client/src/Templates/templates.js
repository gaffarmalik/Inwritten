import React from 'react';
import '../../Resources/styles/comment.scss';
import '../../Resources/styles/template.scss';
import { Icon, Button, Message, Divider, Container, Grid, Item, Input, Modal, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import '../../Resources/styles/react-carousel.scss';
import TemplateController from "../../Controllers/templates.controller";





class Templates extends React.Component {

    constructor(props) {
        super(props);
        //State Object
        this.state = {

            templates: [],
            loading: true,
            open_options: false,
            selected: {},
            save_text: "",
            save_disabled: false,
            my_template: {}
        }

    }

    //Show Modal
    showModal = (event, a) => {
        console.log(a)
        this.setState({ open_options: true, selected: a })

    }

    //Close Modal
    close = () => {
        this.setState({ open_options: false })
    }


    //COMPONENT HOOK: ComponentDidMount
    async componentDidMount() {
        var templ = new TemplateController();
        let { template_id } = this.props.ProfileReducer;
        try {
            let mine = await templ.my_template(template_id)
            var result = await templ.get_templates(template_id)
            console.log(mine, result, "THIS IS BOTH OF THEM")
            if (mine.message !== null) {
                let templates = result.data.filter((v, i, a) => v._id != this.props.ProfileReducer.template_id)
                this.setState({ templates, my_template: mine.message })
                console.log(templates, "this one na gbege")
            }

        } catch (error) {
            console.log("Something wrong has happened", error)

        }
    }



    // SAVE TEMPLATE TO DB
    save_template = async (ev, data) => {

        this.setState({ save_disabled: true })
        let tempControl = new TemplateController()
        try {

            await tempControl.save_template(data._id);
            let updated = await tempControl.get_templates(data._id);


            this.setState({
                save_text: 'Template activated successfully!',
                //open_options: false,
                save_disabled: false,
                templates: updated.data,
                my_template: data
            })

        }
        catch (err) {
            this.setState({ save_text: 'Unable to activate template' })


        }

    }


    // Component RENDER FUNCTION
    render() {
        var { templates, selected, my_template } = this.state;

        if (templates.length == 0) {
            return (
               <Container>
               <div className="comment-div" style={{ marginTop: "0px !important" }}>
                    <h3 style={{ color: "black" }}>Templates</h3>
                    <p>Loading Templates. Hang on!...</p>
                </div>
                </Container>
            )
        }
        else
            return (
                <Container>
                    <Modal open={this.state.open_options}
                    closeOnDimmerClick={true}
                    onClose={this.close}>

                        <Modal.Header>
                        {this.state.selected.template_name}
                        </Modal.Header>
                        <Modal.Content >
                        <h4 style={{marginBottom:"12px"}}>Details</h4>
                        <Image size="medium" src={this.state.selected.featured_image}></Image>

                        <div style={{color:"black !important",marginTop:"20px"}}>
                        <span ><b>Description</b></span>
                        <p>{this.state.selected.template_description}</p>
                        <span><b>Designed By</b></span>
                        <p>Inwritten.com</p>
                        <span><b>Best Categories</b></span>
                        <p>Business, Lifestyle, Food, Technology</p>
                        </div>
                        <Divider></Divider>
                        <div style={{color:"black !important"}}>
                        <h4>Out-of-the-box Support</h4>
                        <span><b>SEO</b></span>
                        <p>Template is designed to comply with SEO (Search Engine Optimisation) Standards</p>
                        <span><b>Pages</b></span>
                        <p>2 (Index Page, Author Space)</p>
                        <span><b>Access</b></span>
                        <p>Free</p>
                        <span><b>View Demo</b></span>
                        <p><a href="https://www.inwritten.com">https://www.inwritten.com</a></p>
                        </div>       
                     </Modal.Content>
                     <Modal.Actions>
                         <Button onClick={this.close}>close</Button>
                     </Modal.Actions>
                    </Modal>
                    <div className="comment-div" style={{ marginTop: "0px !important" }}>

                        <Grid>
                            <Grid.Row >
                                <Grid.Column computer={16} mobile={16} tablet={15} >

                                    <h3 style={{ color: "black" }}>My Templates (2)</h3>
                                    <p>Preset templates help define structures to publish your stories. Worry less of design, promote a good content</p>

                                    <div className="template-container" style={{ backgroundImage: `url('${my_template.featured_image}')` }}>
                                        <div className="template-cover">
                                            <h1>  {my_template.template_name} </h1>
                                            <p>  {my_template.template_description} <u>(you are currently using this)</u> </p>
                                        </div>
                                    </div>
                                </Grid.Column >
                            </Grid.Row >
                            <Grid.Row stretched >

                                <Grid.Column computer={16} mobile={16} tablet={15} >

                                    <Input type="text" size="small" placeholder="Search Store" />

                                </Grid.Column >
                                <Grid.Column computer={16} mobile={16} tablet={15} >

                                    {this.state.save_text == "Template activated successfully!" ?
                                        <Message size='small' positive>
                                            <p><Icon name="check circle outline" color="green" size="big" /> {this.state.save_text}</p></Message> : ""}

                                    {this.state.save_text == 'Unable to activate template' ?
                                        <Message negative>
                                            <p><Icon name="cross" color="red" size="big" /> {this.state.save_text}</p></Message> : ""}

                                </Grid.Column >

                            </Grid.Row>
                            <Grid.Row stretched >

                                <Divider />


                                {templates.map((e, i, a) => {
                                    return (
                                        <Grid.Column style={{ marginBottom: '10px' }} computer={5} mobile={16} tablet={5} >

                                            <Item style={{ marginBottom: '4px' }} key={e._id} >
                                                <Item.Image floated="right" size="tiny" src={e.featured_image} />

                                                <Item.Content >
                                                    <Item.Header as='h3'>{e.template_name}</Item.Header>
                                                    <Item.Meta as="b">Description</Item.Meta>
                                                    <Item.Description>
                                                        {e.template_description}
                                                    </Item.Description>
                                                    <Item.Extra style={{ marginTop: "10px" }}>

                                                        <Button size="tiny" secondary disabled={this.state.save_disabled} onClick={(evt) => { this.save_template(evt, e) }} icon='angle right' >Activate <Icon name="angle right" /></Button>
                                                        <span>&nbsp;&nbsp;<Button size="tiny"  onClick={(evt)=> this.showModal(evt,e )}>More Details</Button></span>
                                                    </Item.Extra>
                                                </Item.Content>
                                            </Item>





                                        </Grid.Column >)

                                })}

                            </Grid.Row>


                        </Grid>
                    </div>

                </Container>
            )


    }


}


//Map Redux state to props
const mapStateToProps = (state) => {
    return state;
}


//Export
export default withRouter(connect(mapStateToProps)(Templates));






