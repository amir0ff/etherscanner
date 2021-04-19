import React from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import logo from '../../src/ethereum-eth.svg'

const Header = () => {
    return (
        <Navbar color="light">
            <NavbarBrand><img src={logo} alt="icon" className="logo"/> EtherScanner</NavbarBrand>
        </Navbar>
    )
}

export default Header;