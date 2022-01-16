import * as React from 'react';
import {useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getUser, getUserId, logout } from '../services/SessionService';
import { getServerInfo } from '../services/InfoService';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { getBookRequestCount, addOnRequestCountChange, setBookRequestCount } from '../services/GlobalSingleton'
import { getOpenRequest } from '../services/RequestService';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

type PageType = {
  title: string,
  href: string
}
const allPages = [
  {title: 'Pedido Aberto', href: '/current-request'},
  {title: 'Livros', href: '/books'},
  {title: 'Pedidos', href: '/requests'},
  {title: 'Minhas Pendências', href: '/pending-books'},
  {title: 'Todas Pendências', href: '/all-pending-books'},
];

const onlyPublicPages = [
  {title: 'Livros', href: '/books'},
  {title: 'Entrar', href: '/login'},
];

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
// const settings = [{title: '1'}];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [pages, setPages] = React.useState([] as PageType[]);
  const [settings, setSettings] = React.useState([] as any[]);
  const [avatarLetter, setAvatarLetter] = React.useState("??");
  const [serverIp, setServerIp] = React.useState("");
  const [cartCount, setCartCount] = React.useState(0);
  const [showCart, setShowCart] = React.useState(false);

  useEffect(() => {
    const userId = getUserId();
    getOpenRequest(userId).then((request) => {
      setBookRequestCount(request.books.length);
      setCartCount(request.books.length)
    })
  })

  const handleOpenUserMenu = (event : any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e: any) => {
    setAnchorElNav(null);
  };
  
  const handleClickMenu = (key: string) => {
    setAnchorElNav(null);
    console.log(key)
    if(key === 'logout') {
      logout()
      window.location.href = '/'
    }
    else if(key === 'login') {
      window.location.href = '/login'
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    getServerInfo().then(data => {
      setServerIp(data.ip)
    })
    .catch(err => {

    })
  })
  useEffect(() => {
    const user = getUser()
    if(user) {
      setPages(allPages)
      setSettings([
        {title: user.name, key: 'user', disabled: true},
        {title: 'Sair', key: 'logout'}
      ])

      const [a, b] = user.name.split(' ')
      setAvatarLetter(`${a[0]}${(b || "")[0] || ""}`)
      setShowCart(true)
    }
    else {
      setPages(onlyPublicPages)
      setSettings([
        {title: 'Entrar', key: 'login'}
      ])
      setShowCart(false)
    }
  },[])

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { md: 'flex' } }}
          >
            Santos Variedades
          </Typography>

          <Box sx={{ flexGrow: 1, display: {md: 'flex' } }}>
              
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={handleCloseNavMenu}
                href={page.href}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, verticalAlign: 'middle', display: {md: 'flex' } }}>
            {showCart && 
              <IconButton aria-label="cart" href='/current-request' sx={{mr: 2}}>
                <StyledBadge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>  
            }
            <Typography sx={{mr: 2}}>{serverIp}</Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  {avatarLetter}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.title} 
                  disabled={setting.disabled || false}
                  onClick={() => handleClickMenu(setting.key)}>
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
