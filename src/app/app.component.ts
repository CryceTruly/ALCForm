import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import * as validUrl from 'valid-url';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private submissionForm: AngularFirestoreCollection<any>;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore) {

  }

  title = 'project';

  ourForm: FormGroup;

  submitting = false;
  submitted = false;

  ngOnInit(): void {

    this.submissionForm = this.firestore.collection('submissions');
    this.ourForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      track: ['', Validators.required],
      screenshots: ['', [Validators.required, this.isValidURL]],
      githubURL: [''],
      feedback: ['', Validators.required]
    });
  }

  trackChanged(val: string) {
    console.log(val);

    const githubURLControl = this.ourForm.get('githubURL');

    if (val === 'Android') {
      githubURLControl.setValidators([Validators.required, this.isValidURL]);
    } else {
      githubURLControl.clearValidators();
    }
    githubURLControl.updateValueAndValidity();
  }


  isValidURL(control: FormControl): { [key: string]: boolean } | null {

    if (control.value.length > 1 && !validUrl.isHttpUri(control.value)) {
      return { validURL: true };
    }
    return null;
  }


  submitData(value: any) {
    console.log(this.submitted);

    this.submitting = true;
    this.submissionForm.add(value).then(res => {
      this.submitted = true;
    }).catch(err => console.log(err)
    ).finally(() => {
      this.submitting = false;
    });

  }

}
