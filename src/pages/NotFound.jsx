import { Link } from "react-router-dom";

function NotFound() {
    return(
        <div style={{ textAlign: "center", marginTop: "80px"}}>
            <h1>404</h1>
            <p>Halaman tidak ada anu</p>
            <Link to="/">Kembali ke Halaman Utama</Link>
        </div>
    )
}

export default NotFound;