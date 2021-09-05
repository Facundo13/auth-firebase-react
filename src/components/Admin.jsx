import React from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router-dom';


const Admin = (props) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        if (auth.currentUser){
            setUser(auth.currentUser)
        }else{
            props.history.push('/login')
        }
    }, [props.history])

    return (
        <div>
           <h2>Bienvenido a la zona de administracion</h2> 
           {
               user && (
                   <h3>Usuario: {user.email}</h3>
               )
           }
        </div>
    )
}

export default withRouter(Admin)
