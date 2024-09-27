import Image from "next/image";

import copyImage from "../public/icons/copy-icon.svg";
import coinImage from "../public/icons/coin.svg";
import eyeImage from "../public/icons/eye.svg";
import sortImage from "../public/icons/sort-icon.svg";
import arrowUpGreenImage from "../public/icons/arrow-up-green.svg";


const DEFAULT_WIDTH = 16;
const DEFAULT_HEIGHT = 16;

const CopyImage = ({ w = DEFAULT_WIDTH, h = DEFAULT_HEIGHT }) => {
  return <Image src={copyImage} width={w} height={h} alt="copy icon" />;
};

const CoinImage = ({ w = DEFAULT_WIDTH, h = DEFAULT_HEIGHT }) => {
  return <Image src={coinImage} width={w} height={h} alt="coin icon" />;
};

const EyeImage = ({ w = DEFAULT_WIDTH, h = DEFAULT_HEIGHT }) => {
  return <Image src={eyeImage} width={w} height={h} alt="eye icon" />;
};

const SortImage = ({ w = DEFAULT_WIDTH, h = DEFAULT_HEIGHT }) => {
  return <Image src={sortImage} width={w} height={h} alt="sort icon" />;
};

const ArrowUpGreenImage = ({ w = DEFAULT_WIDTH, h = DEFAULT_HEIGHT }) => {
  return <Image src={arrowUpGreenImage} width={w} height={h} alt="arrow up green icon" />;
};

const Icons = {
  CopyImage,
  CoinImage,
  EyeImage,
  SortImage,
  ArrowUpGreenImage,
};

export default Icons;
