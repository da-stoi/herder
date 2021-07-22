import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { AccountCircleRounded, HomeRounded, MeetingRoomRounded, SearchRounded } from '@material-ui/icons';
import { useRouter } from 'next/router';

export default function BottomNav() {
  const router = useRouter();

  return (
    <BottomNavigation
      className="mobile-nav"
      value={router.pathname.slice(1)}
      onChange={(event, newValue) => {
        window.location.href = `../${newValue}`
      }}
      showLabels
    >
      <BottomNavigationAction label="Home" value="" icon={<HomeRounded />} />
      <BottomNavigationAction label="Roommates" value="roommates" icon={<MeetingRoomRounded />} />
      <BottomNavigationAction label="Search" value="search" icon={<SearchRounded />} />
      <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleRounded />} />
    </BottomNavigation>
  );
}