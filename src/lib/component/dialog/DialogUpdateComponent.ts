import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { messages } from "../../constants/messages";
import {
  getEntityIdVariable,
  getEntityNameVariable,
} from "../../utils/decorator-utils";
import { CREATE_UPDATE_DIALOG_CSS } from "../../utils/style-utils";
import { CREATE_UPDATE_DIALOG_HTML } from "../../utils/template-utils";

@Component({
  selector: "ia-dialog-update",
  styles: [CREATE_UPDATE_DIALOG_CSS],
  template: CREATE_UPDATE_DIALOG_HTML,
  encapsulation: ViewEncapsulation.None,
})
export class DialogUpdateComponent implements OnInit {
  model: any;
  entityId: number;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.model = data.model;
    let entityIdVariable = getEntityIdVariable(this.model);
    this.entityId = this.model[entityIdVariable];
    let entityNameVariable = getEntityNameVariable(this.model);
    this.title =
      messages.updateDialogTitlePrefix + this.model[entityNameVariable];
  }

  ngOnInit(): void {}

  onSubmit(data: any) {
    this.dialogRef.close({
      model: data,
      index: this.entityId,
    });
  }

  onCloseClick(): void {
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}