# NgrxExamples

Proyecto de ejemplo para el curso de NGRX generado con [Angular CLI](https://github.com/angular/angular-cli) version 15.1.1.
El proyecto consiste en una aplicación donde podemos ver algunas estadísticas históricas de los peores jugadores de fútbol de la liga española de primera división.

## Ejecución de la aplicación

Para ejecutar la aplicación es necesario ejecutar el servidor Json con `npm run back-server` y posteriormente la aplicación web con `npm run start`.

## Explicaciones

### Día 1

#### Estructura de la aplicación de ejemplo

Para comenzar este primer día de trabajo repasaremos rápidamente la estructura de la aplicación:

- Las funcionalidades están divididas en directorios a modo de dominios dentro del "features" en los cuales tendremos a su vez los siguientes directorios:
  - components: contiene componentes sin lógica, como tablas, cards, listas, etc. (componentes dummy).
  - containers: contiene componentes con lógica (pantallas).
  - models: interfaces y enumerados utilizados solo dentro del dominio.
  - services: servicios para conectar con el backend.

#### Instalando NgRx

Comprobamos que para entrar en la aplicación necesitamos iniciar sesión. Para ello vamos a utilizar un estado que mantenga la información de la sesión de usuario.

Primero instalaremos [NgRx](https://ngrx.io/) y para ello ejecutamos el comando npm i

```sh
npm i @ngrx/store@latest
```

Instalamos también ngrxEffects, el cuál nos permitirá lanzar efectos secundarios asociados a las acciones. Para ello ejecutamos:

```sh
npm i @ngrx/effects@latest
```

y lo añadimos también al boostrapApplication.

Vamos a instalar también los schematics que nos ayudarán en el proceso de generar los diferentes estados:

```sh
npm install @ngrx/schematics --save-dev
```

Finalmente instalaremos la herramienta store-devetools. Una herramienta que, nos permite ver cómo va modificándose el Store y qué acciones se van ejecutando. Para instalarla ejecutamos el siguiente comando:

```sh
npm i @ngrx/store-devtools@latest
```

Nos instalaremos también en el navegador la herramienta Redux DevTools para ver de forma gráfica cómo se modifica el Store.

- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es)
- [Firefox](https://addons.mozilla.org/es/firefox/addon/reduxdevtools/)

Una vez instaladas todas las librerías, al no tener módulos, tenemos que añadir las dependencias al método bootstrapApplication del archivo main.ts.
Existen varias formas de importar las dependencias. Podemos importar los "antiguos" módulos directamente dentro de una función imporProvidersFrom

```javascript
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes),
      StoreModule.forRoot({}),
      EffectsModule.forRoot({}),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
    ),
    getEnvironmentProvider(environment),
  ],
});
```

O por el contrario, podemos utilizar las nuevas funciones standalone que nos permiten cargar las dependencias sin necesidad de usar módulos. Estas son algunas de las que tenemos disponibles:

- provideStore() --> StoreModule.forRoot({})
- provideEffects() --> EffectsModule.forRoot({})
- provideStoreDevtools() --> StoreDevtoolsModule.instrument()
- provideRouter() --> RouterModule.forRoot({})

```javascript
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideStore(),
    provideEffects({}),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    getEnvironmentProvider(environment),
  ],
});
```

#### Generando un estado "clásico"

Vamos a generar el estado para gestionar la autenticación. En nuestro ejemplo, la autenticación no va a pertenecer a una feature concreta, sino que va a ser un estado global de la aplicación que deberá cargarse siempre que la aplicación se inicie. Además será un estado compartido que podrá ser utilizado desde diferentes features.
Para ello vamos a generar los archivos del estado en el directorio "shared/auth" en un subdirectorio llamado "state".

Además, queremos que se cargue con el módulo auth.module, el cuál cargaremos al iniciar la aplicación, por lo que añadiremos la opción "-m shared/auth/shared-auth.module.ts" para indicar en qué módulo queremos que se cargue nuestro estado.

Para generar el estado para la autenticación vamos a ejecutar el siguiente comando:

```sh
ng generate @ngrx/schematics:feature shared/auth/state/Auth --skip-tests
```

Vemos que nos ha generado un directorio en shared/auth/state dentro del cual ha creado ficheros para acciones, efectos, reducer y selectores con contenido de ejemplo. Comprobamos también que se ha registrado el feature del estado en el módulo shared-auth.module.ts, así como los efectos.

En primer lugar, definiremos el objeto que contendrá la información de nuestro estado. Queremos guardar la información que nos devuelve el login, el id de usuario y el accessToken. Además vamos a añadir un campo para almacenar errores y otro para conocer cuándo el estado está siendo modificado porque hay alguna acción en curso: Para ello iremos al fichero auth.reducer.ts y crearemos la interfaz siguiente:

```javascript
export interface State {
  id: number | null;
  accessToken: string | null;
  error: string | null;
  loading: boolean;
}
```

Definimos también el estado inicial con todos sus campos a nulo.
Añadimos la dependencia de SharedAuthModule a los imports de login.module.ts.

```javascript
imports: [
  CommonModule,
  FormsModule,
  SharedAuthModule,
  ReactiveFormsModule,
  RouterModule.forChild([
    {
      path: "",
      component: LoginContainerComponent,
    },
  ]),
];
```

Si abrimos el navegador y entramos en el plugin de reduxDevTools podremos ver cómo se carga el estado auth por defecto al entrar en la aplicación y aparecer la pantalla de login. Sin embargo, si entramos directamente en la url localhost/home vemos que no hay ningún estado ¿por qué?. En este caso, hemos creado el estado auth como feature que se carga por lazyLoading al entrar en la pantalla de login.
El estado de auth debería ser global, ya que con él podríamos crear guards que impidan el acceso a pantallas sin estar logueado. Si queremos que un estado sea totalmente global tenemos dos opciones:

- Añadirlo al StoreModule.forRoot y al EffectsModule.forRoot del app.module.ts
- Añadirlos al módulo shared-auth.module.ts como feature e importar el módulo en el app.module.ts

A continuación definimos las acciones. Eliminaremos las acciones por defecto creadas y crearemos unas con una semántica más correcta.

```javascript
export const userLogin = createAction(
  '[Login Page] Login User',
  props<{ email: string; password: string }>()
);

export const loginUserSuccess = createAction(
  '[Auth API] Login User Success',
  props<{ id: number; accessToken: string }>()
);

export const loginUserFailure = createAction(
  '[Auth API] Login User  Failure',
  props<{ error: any }>()
);

```

A continuación tenemos que modificar el reducer para indicar cómo cambia el estado según las acciones que se han ejecutado.
Vamos a crear el reducer utilizando el método creatFeature para que nos genere de forma automática los selectores para las propiedades de estado.

```javascript
export const authFeature = createFeature({
  name: "auth",
  reducer: createReducer(
    initialState,
    on(AuthActions.userLogin, (state) => ({ ...state, loading: true })),
    on(AuthActions.loginUserSuccess, (state, action) => ({
      ...state,
      id: action.id,
      accessToken: action.accessToken,
      loading: false,
    })),
    on(AuthActions.loginUserFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    }))
  ),
});
```

Ya tenemos listas las acciones y el reducer. Ahora necesitamos disparar el efecto que llamará a backend una vez se lance la acción de loginUser. Para ello vamos al archivo de efectos y creamos el siguiente efecto:

```javascript
loginUser$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(AuthActions.userLogin),
    switchMap((action) =>
      this.authService
        .loginUser({ email: action.email, password: action.password })
        .pipe(
          map((response) =>
            AuthActions.loginUserSuccess({
              id: response.user.id,
              accessToken: response.accessToken,
            })
          ),
          catchError((error) => of(AuthActions.loginUserFailure({ error })))
        )
    )
  );
});
```

Finalmente en el archivo auth.selectors generamos los selectores a partir del authFeature:

```javascript
export const {
  selectAccessToken,
  selectError,
  selectId,
  selectLoading,
  selectAuthState,
} = authFeature;
```

Ahora necesitamos lanzar la acción de userLogin una vez se pulse el botón de "Entrar" en la pantalla de login. Para ello accedemos al componente login-container.component.ts y añadimos la dependencia del Store al constructor.

```javascript
constructor(private formBuilder: FormBuilder, private store: Store) {}
```

En el método sendLogin tenemos que llamar a la acción. Para ello utilizamos el método "dispatch" del store, el cuál nos permite lanzar acciones.

```javascript
sendLogin() {
    this.store.dispatch(
      AuthActions.userLogin({
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      })
    );
  }
```

Si vamos al login y abrimos el reduxDevTools veremos cómo el estado "auth" se ha iniciado con los valores iniciales.
Si introducimos email y contraseña y pulsamos "Enter" veremos que se lanza la acción "Login user", la cuál a su vez lanzará "Login User Success" o "Login User Failure" en función de la respuesta de backend.

Si introducimos valores de usuario válidos:

- email: usuario@prueba.es
- password: patata

Vemos que se lanza la acción "Login User Success". Sin embargo, una vez logueado seguimos estando en la misma pantalla. ¿Cómo podemos hacer para que cuando el login sea exitoso la aplicación navegue a la home? La respuesta es creando un nuevo efecto.

Para ello volvemos al fichero auth.effects.ts, añadimos la dependencia del router al constructor y creamos el siguiente efecto:

```javascript
navigateToHome$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.loginUserSuccess),
      tap(() => this.router.navigate(["/home"]))
    ),
  { dispatch: false }
);
```

Este efecto tiene una peculiaridad. No lanza nuevas acciones, simplemente realiza una navegación. Cuando un efecto no lance acciones es necesario indicar `{ dispatch: false }`.

Ahora sólo nos falta cargar el estado en el componente standalone de login-container.
Recordemos que utilizando módulos, al generar el feature teníamos la opción de indicar el módulo en el que queríamos que se registrase el estado y los efectos. En nuestro caso, era el módulo shared-auth.module.ts. Posteriormente, si queríamos importar el store sólo teníamos que importar el módulo SharedAuthModule en el módulo login.module.ts.

```javascript
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class SharedAuthModule {}
```

```javascript
@NgModule({
  declarations: [
    LoginContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedAuthModule,
    ... //otros módulos necesarios
    ])
  ]
})
export class LoginModule { }
```

Sin módulos, el procedimiento es diferente. Únicamente necesitamos importar directamente el estado y los efectos en el archivo de rutas donde cargamos de forma lazy el componente login-container.ts. Añadiremos la opción "providers" y utilizando los métodos standalone de ngrx "provideState" y "provideEffects" cargaremos la feature y los efectos de auth.

```javascript
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { authFeature } from '@ngrx-example/shared/auth/state/auth.reducer';
import { AuthEffects } from '@ngrx-example/shared/auth/state/auth.effects';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import(
        '@ngrx-example/features/login/containers/login-container/login-container.component'
      ).then((c) => c.LoginContainerComponent),
    providers: [provideState(authFeature), provideEffects([AuthEffects])],
  },
  ... //otras rutas

```

Ahora ya podemos ir al componente login-container.component.ts y conectarnos al selector.
Para obtener el valor nos suscribiremos a él desde la vista utilizando el pipe async de manera que sea la vista la que reaccione de forma reactiva a los cambios en el valor de User y además sea la que se desuscriba automáticamente del observable una vez se destruya el componente. Es importante hacer selectores específicos en lugar de devolver el estado al completo. Si nos suscribimos a un selector con el estado completo, cualquier cambio dentro de este provocará el refresco del componente. Si devolvemos únicamente los campos que necesitamos, sólo refrescaremos la vista en los casos en los que el valor devuelto por el selector cambie.

Importaremos los selectores con `import * as AuthSelectors from '@ngrx-example/shared/auth/state/auth.selectors';` y conectaremos con el selector selectError:

```javascript
error$ = this.store.select(AuthSelectors.selectError);
```

En la vista creamos un div con un mensaje de error y nos suscribimos al observable con el pipe async

```html
<div
  class="p-3 text-xl text-center text-red-900 bg-red-300"
  *ngIf="error$ | async"
>
  <p>Inicio de sesión incorrecto</p>
</div>
```
