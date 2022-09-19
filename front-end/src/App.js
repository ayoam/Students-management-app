import './assets/styles/App.css';
import Login from "./components/login/Login";
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.css'
import Register from "./components/register/Register";
import {Routes,Route,Navigate} from "react-router-dom";
import Students from "./components/students/Students";
import PersistLogin from "./components/persistLogin/PersistLogin";
import RequireAuth from "./components/requireAuth/RequireAuth";
import StudentsAdmin from "./components/admin/students/Students-admin";
import PreventLogged from "./components/preventLogged/PreventLogged";

function App() {
  return (
      <>
        <Routes>
            <Route element={<PreventLogged/>}>
                {/*public routes*/}
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Route>

            <Route element={<PersistLogin/>}>
                {/*protected routes*/}
                <Route element={<RequireAuth allowedRoles={["ROLE_USER"]} />}>
                    <Route path="/students" element={<Students/>}/>
                </Route>
                <Route element={<RequireAuth allowedRoles={["ROLE_ADMIN"]} />}>
                    <Route path="/admin/students" element={<StudentsAdmin/>}/>
                </Route>
            </Route>

            <Route path="/unauthorized" element={<p>unauthorized</p>} />
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </>
  );
}


export default App;
