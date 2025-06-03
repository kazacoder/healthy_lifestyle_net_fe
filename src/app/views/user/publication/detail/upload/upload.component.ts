import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {UploadItemComponent} from './upload-item/upload-item.component';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Settings} from '../../../../../../settings/settings';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AdditionalImageType} from '../../../../../../types/additional-image.type';

@Component({
  selector: 'publication-upload',
  imports: [
    UploadItemComponent,
    NgIf,
    NgForOf
  ],
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnChanges {

  @Input() currentPublicationImages: {mainImage: string, additionalImages: AdditionalImageType[]} | null = null
  @Output() onImageChange: EventEmitter<any> = new EventEmitter();
  imagePreview: string | ArrayBuffer | null = null;
  imagesChanged: { main: boolean, additional: boolean } = { main: false, additional: false }
  additionalImagePreview: { file: string | ArrayBuffer | null, name: string, id: number | null }[] = [];
  maxAdditionEventPhotoCount = Settings.maxAdditionEventPhotoCount
  fileName: string | null = null;
  publicationImagesForm: FormGroup = this.fb.group({
    mainImage: [null],
    additionalImages: this.fb.array([])
  })
  existingFilesIds: number[] = [];

  constructor(private fb: FormBuilder,
              private _snackBar: MatSnackBar,) {

  }

  ngOnChanges() {
    if (this.currentPublicationImages) {
      this.imagePreview = this.currentPublicationImages.mainImage
      this.currentPublicationImages.additionalImages.forEach(item => {
        this.additionalImagePreview.push({file: item.file, name: item.file, id: item.id});
      })
    }
    this.currentPublicationImages?.additionalImages.forEach(item => {this.existingFilesIds.push(item.id)})
  }

  onFileChange(event: Event, mainImage: boolean = true): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    if (mainImage) {
      this.fileName = file.name;
      this.publicationImagesForm.patchValue({ mainImage: file });
      this.publicationImagesForm.get('mainImage')?.updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      this.imagesChanged.main = true;
    } else {
      const imageArray = this.publicationImagesForm.get('additionalImages') as FormArray
      if (this.additionalImagePreview.length < Settings.maxAdditionEventPhotoCount &&
        this.additionalImagePreview.findIndex(item => item.name === file.name) === -1) {
        imageArray.push(
          this.fb.control({image: file})
        );
        reader.onload = () => {
          this.additionalImagePreview.push({file: reader.result, name: file.name, id: null});
        };
      } else {
        this._snackBar.open(`Максимальное кольчество дополнительных фотографий ${Settings.maxAdditionEventPhotoCount}`)
      }
      this.imagesChanged.additional = true
    }

    reader.readAsDataURL(file);
    this.onImageChange.emit([this.publicationImagesForm, this.imagesChanged, this.existingFilesIds]);
    input.value = '';
  }


  removeImage(fileName: string, mainImage: boolean = false) {
    if (mainImage) {
      this.fileName = null;
      this.imagePreview = null;
      this.publicationImagesForm.patchValue({ mainImage: null });
      this.publicationImagesForm.get('mainImage')?.updateValueAndValidity();
      this.imagesChanged.main = true
    } else {
      const imageArray = (this.publicationImagesForm.get('additionalImages') as FormArray);
      const index = imageArray.controls.findIndex(control => {
        return control.value.image.name === fileName;
      })
      imageArray.removeAt(index)

      this.existingFilesIds = []
      this.additionalImagePreview.forEach(item => {
        if (item.name !== fileName && item.id) {
          this.existingFilesIds.push(item.id);
        }
      });
      this.additionalImagePreview = [...this.additionalImagePreview.filter(item => item.name !== fileName)];
      this.imagesChanged.additional = true
    }
    this.onImageChange.emit([this.publicationImagesForm, this.imagesChanged, this.existingFilesIds]);
  }
}
