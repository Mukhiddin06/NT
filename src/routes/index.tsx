import { Route, Routes } from "react-router-dom"
import { Agreement, Login } from "../pages"

const CustomRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/agreement" element={<Agreement/>}/>
    </Routes>
  )
}

export default CustomRoutes