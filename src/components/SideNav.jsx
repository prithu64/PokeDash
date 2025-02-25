import { first151Pokemon, getFullPokedexNumber } from "../utils"

export default function SideNav({selectedPokemon,setSelectedPokemon}){
    return(
        <nav>
            <div className={"header"}>
              <h1 className="text-gradient">PokeDash</h1>
            </div>
            <input />
            {first151Pokemon.map((pokemon,pokenmonIndex)=>{
                return (
                    <button onClick={()=>{
                        setSelectedPokemon(pokenmonIndex)
                    }} className={'nav-card' + (pokenmonIndex===selectedPokemon?'nav-card-selected':' ')} key={pokenmonIndex}>
                        <p>{getFullPokedexNumber(pokenmonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}