import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiAdjustments 
} from 'react-icons/hi'
import { GiMuscleUp } from "react-icons/gi";


import { GoDot } from "react-icons/go";

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    ajustes: <HiAdjustments />,
    punto: <GoDot />,
    musculos: <GiMuscleUp />,
}

export default navigationIcon
