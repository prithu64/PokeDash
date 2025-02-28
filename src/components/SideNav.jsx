import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

export default function SideNav({selectedPokemon,setSelectedPokemon,handleCloseMenu,showSideMenu}){
    const [searchValue,setSearchValue] = useState('');
    
    const filteredPokemon = first151Pokemon.filter((ele,eleIndex)=>{
       //if the full pokedex number name includes the current search value , return true
        if((getFullPokedexNumber(eleIndex)).includes(searchValue)){return true}
       //if the pokemon name includes the current search value,return true
       if(ele.toLowerCase().includes(searchValue.toLowerCase())){return true}
       //otherwise ,exclude value from the array
       return false
    })
    return(
        <nav className={''+(!showSideMenu?" open":" ")}>
            <div className={"header " + (!showSideMenu?" open":" ")}>
              <button onClick={handleCloseMenu} className="open-nav-button">
              <i className="fa-solid fa-arrow-left-long"></i>
              </button>
              <h1 className="text-gradient">PokeDash</h1>
            </div>
            <input value={searchValue} onChange={(e)=>{
                setSearchValue(e.target.value);
            }} />
            {filteredPokemon.map((pokemon,pokenmonIndex)=>{
                const TrueIndexNum = first151Pokemon.indexOf(pokemon)
                return (
                    <button onClick={()=>{
                        setSelectedPokemon(TrueIndexNum)
                        handleCloseMenu()
                    }} className={'nav-card' + (pokenmonIndex===selectedPokemon?'nav-card-selected':' ')} key={pokenmonIndex}>
                        <p>{getFullPokedexNumber(TrueIndexNum)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}