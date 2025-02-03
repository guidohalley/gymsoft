import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ExercisesProvider } from '@/hooks/useExercises';
import store, { persistor } from './store';
import Theme from '@/components/template/Theme';
import Layout from '@/components/layouts';
import appConfig from '@/configs/app.config';
import './locales';

const environment = process.env.NODE_ENV;

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Theme>
                        <ExercisesProvider>
                            <Layout />
                        </ExercisesProvider>
                    </Theme>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
