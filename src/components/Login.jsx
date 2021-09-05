import React from 'react'
import {auth, db} from '../firebase'
import { withRouter } from 'react-router-dom';

const Login = (props) => {

    const [email,setEmail] = React.useState('');
    const [pass,setPass] = React.useState('');
    const [error, setError] = React.useState(null);
    const [esRegistro, setEsRegistro] = React.useState(true);

    const procesarDatos = e => {
        e.preventDefault();
        if(!email.trim()){
            setError('Ingrese email')
            return;
        }
        if(!pass.trim()){
            setError('Ingrese password')
            return;
        }
        if(pass.length < 6){
            setError('Ingrese un password mayor a 6 caracteres')
            return;
        }

        setError(null);

        if(esRegistro){
            registrar()
        }else{
            loguear();
        }
    }

    const loguear = React.useCallback(async() => {
        try {
            const res = await auth.signInWithEmailAndPassword(email,pass)
            setEmail('');
            setPass('');
            setError(null);
            props.history.push('/admin')
        } catch (e) {
            console.log(e);
            if(e.code === 'auth/wrong-password'){
                setError('La contraseña es incorrecta');
            }
            if(e.code === 'auth/user-not-found'){
                setError('No existe un usuario registrado con ese email');
            }
        }
    },[email,pass, props.history])

    const registrar = React.useCallback(async() =>{
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await db.collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })

            setEmail('');
            setPass('');
            setError(null);
            props.history.push('/admin')

        } catch (e) {
            console.log(e);
            if(e.code === 'auth/invalid-email'){
                setError('El email tiene un formato inválido');
            }
            if(e.code === "auth/email-already-in-use"){
                setError('El email esta siendo utilizado por otra cuenta')
            }
        }
    }, [email, pass, props.history])

    return (
        <div className="mt-5">
            <h3 className="text-center">
                {
                    esRegistro ? 'Registro de usuarios' : 'Login de acceso'
                    
                }
            </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        {
                            error && (
                                <div className="alert alert-danger">{error}</div>
                            )
                        }
                        <input type="email" className="form-control mb-2" placeholder="Introduce tu email" onChange={e => setEmail(e.target.value)} value={email} />
                        <input type="password" className="form-control mb-3" placeholder="Introduce tu password" onChange={e => setPass(e.target.value)} 
                        value={pass}/>
                        <button className="btn btn-dark btn-lg w-100 mb-2" type="submit">
                            {
                                esRegistro ? 'Registrarse' : 'Acceder'
                            }
                        </button>
                        <button className="btn btn-info btn-sm w-100" type="button" onClick={() => setEsRegistro(false)}>
                            {
                                esRegistro ? '¿Ya estas registrado?' : '¿No tienes cuenta?'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
