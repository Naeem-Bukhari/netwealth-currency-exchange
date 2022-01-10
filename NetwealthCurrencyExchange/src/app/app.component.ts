import { CURRENCIES } from './constants/currencies';
import { exchangeDataSelector } from './store/selectors/app.selectors';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, filter, first, lastValueFrom, map, Observable } from 'rxjs';
import { Exchange, Exchanged } from './store/actions/app.actions';
import { AppState } from './store/store-setup';
import * as FromAppActions from './store/actions/app.actions';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Currency } from "src/models/currency";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  exchangedData$!: Observable<Exchanged>;
  currencies: Currency[] = CURRENCIES;
  currencyExchangForm!: FormGroup;
  controlKeys = ControlKeys;

  constructor(private store: Store<AppState>) {}

  async ngOnInit(): Promise<void> {
    this.exchangedData$ = this.store.select(exchangeDataSelector);
    this.currencyExchangForm = this.initFormGroup();
    await this.updateFormWithInitialState(this.currencyExchangForm, this.exchangedData$);
    this.applyExchangeRateWhenFormChanges(this.currencyExchangForm);
  }

  exchangeCurrency(exchangeCurrency: Exchange) {
    this.store.dispatch(FromAppActions.exchangeCurrency(exchangeCurrency));
  }

  private initFormGroup(): FormGroup {
    return new FormGroup({
      [this.controlKeys.From]:             new FormControl(),
      [this.controlKeys.To]:               new FormControl(),
      [this.controlKeys.Amount]:           new FormControl(null, [nonZero()]),
      [this.controlKeys.ConvertedAmount]:  new FormControl()
    });
  }

  private async updateFormWithInitialState(form: FormGroup ,exchangedData$: Observable<Exchanged>): Promise<void> {
    const exchangeData = await lastValueFrom(exchangedData$.pipe(first()));
    this.currencyExchangForm.patchValue({
      [this.controlKeys.From]:              exchangeData.sourceCurrency,
      [this.controlKeys.To]:                exchangeData.destinationCurrency,
      [this.controlKeys.Amount]:            exchangeData.amountToConvert || null,
      [this.controlKeys.ConvertedAmount]:   exchangeData.convertedAmount
    });
  }

  private applyExchangeRateWhenFormChanges(formGroup: FormGroup): void {
    formGroup.valueChanges.pipe(
      debounceTime(500),
      map(({convertedAmount, ...exchangeData}: Exchanged) => exchangeData),
      filter(_ => this.currencyExchangForm.status === 'VALID'),
      filter((exchangeData: Exchange) => !!exchangeData.sourceCurrency && !!exchangeData.destinationCurrency && !!exchangeData.amountToConvert),
    ).subscribe(this.exchangeCurrency.bind(this));
  }
}

export function nonZero(): ValidatorFn {
    return (control: AbstractControl) => (Number(control.value) < 0) ? { nonZero: true } : null
}

enum ControlKeys {
  From = "sourceCurrency",
  To = "destinationCurrency",
  Amount = "amountToConvert",
  ConvertedAmount = "convertedAmount"
}
