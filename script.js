class BlogPlatform {
  constructor(){
    this.toggleBtn = document.getElementById('toggleThemeBtn');
    this.toggleBtn.addEventListener('click', ()=>this.toggleTheme());
    this.applySavedTheme();

    this.journalForm = document.getElementById('journalForm');
    this.titleInput = document.getElementById('journalTitleInput');
    this.richTextEditor = document.getElementById('richTextEditor');
    this.contentArea = document.getElementById('journalContentInput');
    this.tagsInput = document.getElementById('journalTagsInput');
    this.entriesContainer = document.getElementById('journalEntriesContainer');
    this.noEntriesMsg = document.getElementById('noEntriesMsg');
    this.toolbar = document.getElementById('toolbar');

    this.entries = []; this.editId = null;

    this.journalForm.addEventListener('submit', e=>this.handleSubmit(e));
    this.toolbar.addEventListener('click', e=> {
      const cmd = e.target.dataset.command;
      if(cmd){
        document.execCommand(cmd);
        this.sync();
      }
    });
    this.richTextEditor.addEventListener('input', ()=>this.sync());

    document.getElementById('importBtn').addEventListener('click', ()=>document.getElementById('importFileInput').click());
    document.getElementById('importFileInput').addEventListener('change', e=>this.handleImport(e));
    document.getElementById('exportBtn').addEventListener('click', ()=>this.export());
    this.entriesContainer.addEventListener('click', e=>this.handleEntryClick(e));

    this.load(); this.render();
  }

  applySavedTheme(){
    const dark = localStorage.getItem('darkMode')==='1';
    document.body.classList.toggle('dark-mode', dark);
    this.toggleBtn.setAttribute('aria-pressed', dark);
    this.toggleBtn.textContent = dark?'☀️ Light Mode':'🌙 Dark Mode';
  }

  toggleTheme(){
    const dark = document.body.classList.toggle('dark-mode');
    this.toggleBtn.setAttribute('aria-pressed', dark);
    this.toggleBtn.textContent = dark?'☀️ Light Mode':'🌙 Dark Mode';
    localStorage.setItem('darkMode', dark?'1':'0');
  }

  sync(){
    this.contentArea.value = this.richTextEditor.innerHTML;
  }

  validate(){
    let ok=true;
    document.getElementById('titleError').textContent='';
    document.getElementById('contentError').textContent='';
    if(!this.titleInput.value.trim()){document.getElementById('titleError').textContent='Required'; ok=false;}
    if(!this.richTextEditor.innerText.trim()){document.getElementById('contentError').textContent='Required'; ok=false;}
    return ok;
  }

  handleSubmit(e){
    e.preventDefault(); if(!this.validate())return;

    const entry = {
      id: this.editId||('id-'+Date.now()),
      title:this.titleInput.value.trim(),
      content:this.richTextEditor.innerHTML,
      tags:this.tagsInput.value.split(',').map(s=>s.trim()).filter(Boolean),
      ts: new Date().toISOString()
    };
    if(this.editId){
      this.entries = this.entries.map(x=>x.id===entry.id?entry:x);
    } else this.entries.unshift(entry);

    this.save(); this.render(); this.resetForm();
  }

  handleEntryClick(e){
    const btn=e.target;
    const article=btn.closest('.blog-post'); if(!article) return;
    const id=article.dataset.id;
    if(btn.textContent==='Edit'){
      const en = this.entries.find(x=>x.id===id);
      this.titleInput.value = en.title;
      this.richTextEditor.innerHTML = en.content;
      this.tagsInput.value = en.tags.join(', ');
      this.editId = id;
      document.getElementById('saveJournalBtn').textContent='Update';
    }
    if(btn.textContent==='Delete'){
      this.entries = this.entries.filter(x=>x.id!==id);
      this.save(); this.render(); this.resetForm();
    }
  }

  resetForm(){
    this.journalForm.reset();
    this.richTextEditor.innerHTML = '';
    this.editId = null;
    document.getElementById('saveJournalBtn').textContent='Publish Entry';
  }

  render(){
    this.entriesContainer.innerHTML='';
    if(!this.entries.length){
      this.noEntriesMsg.style.display='block'; return;
    }
    this.noEntriesMsg.style.display='none';
    this.entries.forEach(en=>{
      const art=document.createElement('article');
      art.className='blog-post'; art.dataset.id=en.id;
      art.innerHTML=`
        <h3>${en.title}</h3>
        <div>${en.content}</div>
        ${en.tags.length?`<div><em>Tags: ${en.tags.join(', ')}</em></div>`:''}
        <div class="blog-post-actions">
          <button>Edit</button><button>Delete</button>
        </div>`;
      this.entriesContainer.appendChild(art);
    });
  }

  save(){ localStorage.setItem('blogEntries', JSON.stringify(this.entries)); }
  load(){ const d=localStorage.getItem('blogEntries'); this.entries = d?JSON.parse(d):[]; }
  export(){ const blob=new Blob([JSON.stringify(this.entries,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='posts.json'; a.click(); }
  handleImport(e){
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=()=> {
      const arr = JSON.parse(r.result);
      if(Array.isArray(arr)){this.entries=arr; this.save(); this.render();}
      else alert('bad file');
    }; r.readAsText(f);
  }
}

document.addEventListener('DOMContentLoaded', ()=>new BlogPlatform());
