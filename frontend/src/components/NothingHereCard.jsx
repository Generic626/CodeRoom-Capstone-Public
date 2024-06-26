import nothingHereImg from "../assets/landing1.png";

const NothingHereCard = (props) => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <img
        src={nothingHereImg}
        alt="Nothing Here Image, Generated by Stable Diffusion"
        className="w-[250px] h-[250px]"
      />
      {/* Subtitle */}
      <div className="text-center">
        <p className="text-xl mb-2 font-bold">{props.title}</p>
        <div className="text-gray-500 text-sm">{props.subtitle}</div>
      </div>
    </div>
  );
};

export default NothingHereCard;
