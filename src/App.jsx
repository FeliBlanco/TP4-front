import UserContextProvider from './contexts/UserContext'
import Routes from './routes'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <UserContextProvider>
                <Routes />
            </UserContextProvider>
        </LocalizationProvider>
    )
}

export default App
