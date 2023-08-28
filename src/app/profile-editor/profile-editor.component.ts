import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css'],
})
export class ProfileEditorComponent implements OnInit{
  // private formBuilder: any;
  constructor(private fb: FormBuilder) {
  }

  minDate:any;
  maxDate:any;
  regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");


  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z]+$/)]],
    dob: [''],
    email: ['', [Validators.email, Validators.pattern(this.regex)]],
    haveAadhaar: [''],
    aadhaar: ['', [Validators.required]],
    mobiles: this.fb.array([
      this.fb.control('', Validators.pattern(/^[5-9][0-9]{9}$/))
    ]),
    // [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]
    addresses: this.fb.array([this.fb.group({
      street: [''],
      city: [''],
      state: ['', Validators.required],
      zip: ['']
    })]),

    contact: new FormArray([
      new FormGroup({
        type: new FormControl(''),
        contact: new FormControl('')
      })
    ]),


    aliases: this.fb.array([
      this.fb.control('')])
  });
  ngOnInit(){
    this.disablefutureDate();
  }

  addContact(){
    const control = <FormArray>this.profileForm.controls["contact"];
    control.push(
      new FormGroup({
        type: new FormControl(''),
        contact: new FormControl('')
      })
    );
  }

  removeContact(index: number) {
    const control = <FormArray>this.profileForm.controls['contact'];
    control.removeAt(index);
  }

  getControl(name: any) : AbstractControl | null {
    return  this.profileForm.get(name)
  }
  disablefutureDate(){
    var date:any = new Date();
    var todayDate:any = date.getDate();
    if (todayDate < 10){
      todayDate = "0" + todayDate
    }
    var month:any = date.getMonth() + 1;
    var pmonth:any = date.getMonth();
    if (month < 10){
      month = "0" + month
    }
    if (pmonth < 10){
      pmonth = "0" + pmonth
    }
    var year:any = date.getFullYear() - 18;
    this.maxDate = year + "-" + month + "-" + todayDate
    this.minDate = year + "-" + pmonth + "-" + todayDate
    console.log(todayDate);
    console.log(pmonth);
    console.log(this.maxDate);
    console.log(this.minDate);

  }

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log("Input value:", inputElement.value);
  }

  nameValidator(evt: any){
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 8 || charCode === 9) {
      return true;
    }
    return ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123));
  }

  createAddressFormGroup() {
    return this.fb.group({
      street: [''],
      city: [''],
      state: ['', Validators.required],
      zip: ['', [Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  addAddress() {
    const addressArray = this.profileForm.get('addresses') as FormArray;
    console.log(this.profileForm.get('addresses'));
    addressArray.push(this.createAddressFormGroup());
  }

  deleteAddress(index: number){
    this.addresses.removeAt(index);
  }

  get addresses() {
    return this.profileForm.get('addresses') as FormArray;
  }

  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 8 || charCode === 9) {
      return true;
    }
    return !((charCode > 31 && charCode < 48) || charCode > 57);
  }

  addMobile() {
    this.mobiles.push(this.fb.control('', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')]));
  }

  deleteMobile(index: number){
    this.mobiles.removeAt(index);
  }

  get mobiles() {
    return this.profileForm.get("mobiles") as FormArray;
  }

  addAlias() {
    this.aliases.push(this.fb.control(''));
  }

  deleteAlias(index: number) {
    this.aliases.removeAt(index);
  }

  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }

  printValue() {
    console.log(this.profileForm.value);
  }

  changeAd(e:any){
    console.log(e.value)
    if (e.value === 'true'){
      this.profileForm.controls['aadhaar'].setValidators([Validators.required,Validators.pattern(/^[1-9][0-9]{11}$/), Validators.minLength(12), Validators.maxLength(12)])
      this.profileForm.controls['aadhaar'].updateValueAndValidity();
    }
    else{
      this.profileForm.controls['aadhaar'].setValidators(null)
      this.profileForm.controls['aadhaar'].updateValueAndValidity()
    }
  }

  protected readonly JSON = JSON;

  protected readonly FormArray = FormArray;
}
