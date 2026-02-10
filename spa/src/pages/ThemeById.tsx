import { useParams } from "react-router";

const ThemeById = () => {

    const params = useParams();
    const { idTheme } = params;

    console.log('ThemeById params:', params);

    return (
        <div>
            T 
            <h1>{idTheme}</h1>
        </div>
    )
}

export default ThemeById;