import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { FormBuilder, FormGroup, Validators,FormControl, FormArray } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})


export class NewPostComponent implements OnInit {

 permalink: string = '';


 imgSrc: any = './assets/bee_flower3.jpg';
 selectedImg: any;

categories: Array<any> = [];
 formStatus: string = 'Add New';


 postForm:FormGroup
 

  constructor(
    private categoryServices: CategoriesService,
     private fb: FormBuilder, 
     private postService: PostsService) {

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]], 
      permalink: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      excerpt: ['', [Validators.required,Validators.minLength(50)]],    
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required]
    })
  }


  ngOnInit(): void {
    this.categoryServices.loadData().subscribe(val => {
      this.categories = val;
    })
    
  }

  get fc(){
    return this.postForm.controls
  }

  onTitleChanged($event:any){
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
    }

 
  showPreview ($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result
    }
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
    
  }

  onSubmit(){
    console.log(this.postForm.value);
    let splitted = this.postForm.value.category.split('-');
    console.log(splitted);
    
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.except, 
      content: this.postForm.value.content,
      isFeature: false,
      views: 0,
      status: 'new',
      createdAt: new Date()

    }
    this.postService.uploadImage(this.selectedImg, postData);
    this.postForm.reset(); 
    
    
  }

  

  
  get title (){
    return this.postForm.get('title');
  }











}
