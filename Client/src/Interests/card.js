import React from 'react'
import { Item, Grid } from 'semantic-ui-react'
function image_transform(url, width, height){
  //Add height and width to image
   return url.replace("/upload/", `/upload/h_${height},w_${width},c_crop/`)
  }



const ListExampleSelection = (props) =>{ 
    var { index, x } =props;
    return(

        <Grid.Column computer={5} mobile={16} tablet={4} style={{marginTop:"10px"}} >
        <Item style={{marginBottom:'12px'}} key={x._id}>
              <Item.Image floated="right" size="small" style={{height:"100px", width:"100px"}} src={image_transform(x.featured_image, 200, 92 )} />
        
              <Item.Content verticalAlign="middle" >
                <a target="_blank" href={x.post_link}><h4 style={{color:"black", fontSize:"14px"}}>{x.title}</h4></a>
                <Item.Description style={{fontSize:"12px"}}>{x.description==""? "-": x.description}</Item.Description>     
                   <Item.Meta style={{marginTop:'12px'}}>By {x.author} </Item.Meta>
                    
              </Item.Content>
            </Item>
 </Grid.Column>



)

}



export default ListExampleSelection