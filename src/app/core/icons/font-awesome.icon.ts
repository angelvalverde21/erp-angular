import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faLock,
  faHome,
  faCog,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

export function addAppIconsToLibrary() {
  library.add(
    faUser,
    faLock,
    faHome,
    faCog,
    faSignOutAlt
  );
}