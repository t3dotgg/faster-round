import { h, Fragment, FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getOptionsForVote, getRandomPokemon } from "../data/getRandom";
import { ALL_MONS } from "../data/mons";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const getImageForMon = (mon: number) =>
  `https://roundest.t3.gg/_next/image?url=https%3A%2F%2Fraw.githubusercontent.com%2FPokeAPI%2Fsprites%2Fmaster%2Fsprites%2Fpokemon%2F${mon}.png&w=640&q=75`;

const PokemonListing: FunctionComponent<{
  pokemon: number;
  vote: () => void;
  disabled?: boolean;
}> = (props) => {
  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.pokemon}
    >
      <div className="text-xl text-center capitalize mt-[-0.5rem]">
        {ALL_MONS[props.pokemon - 1]}
      </div>
      <img
        src={getImageForMon(props.pokemon)}
        width={256}
        height={256}
        layout="fixed"
        className="animate-fade-in"
      />
      <button
        className={btn}
        onClick={() => props.vote()}
        disabled={props.disabled}
      >
        Rounder
      </button>
    </div>
  );
};

const Voter: FunctionComponent<{ a: number; b: number }> = ({
  children,
  a,
  b,
}) => {
  const [left, setLeft] = useState(a);
  const [right, setRight] = useState(b);

  // Preload all images
  useEffect(() => {
    ALL_MONS.forEach((_, i) => {
      new Image().src = getImageForMon(i);
    });
  }, []);

  // Update vote state
  const voteForRoundest = (vote: number) => {
    const antiVote = vote === left ? right : left;
    console.log("voted", vote, antiVote);

    const newOptions = getOptionsForVote();
    setLeft(newOptions[0]);
    setRight(newOptions[1]);
  };

  return (
    <div class="flex flex-col">
      <div class="flex gap-2 text-xl">
        <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
          <PokemonListing pokemon={left} vote={() => voteForRoundest(left)} />
          <div className="p-8 italic text-xl">{"or"}</div>
          <PokemonListing pokemon={right} vote={() => voteForRoundest(right)} />
          <div className="p-2" />
        </div>
      </div>
      <div class="counter-message">{children}</div>
    </div>
  );
};

export default Voter;
