import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '@ngrx-example/shared/auth/state/auth.actions';
import * as AuthSelectors from '@ngrx-example/shared/auth/state/auth.selectors';
@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  form: FormGroup = this.formBuilder.group({
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  error$ = this.store.select(AuthSelectors.selectError);

  constructor(private formBuilder: FormBuilder, private store: Store) {}

  sendLogin() {
    this.store.dispatch(
      AuthActions.userLogin({
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      })
    );
  }
}
