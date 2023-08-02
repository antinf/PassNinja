import React, {useState} from 'react';
import { Vault } from '../../Classes/Vault';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import { encryptPassword } from '../../Helpers/Passwords';

export default function Password({
    password,
    vault,
    setPasswords
  }:{
    password:any,
    vault:Vault,
    setPasswords:Function
}){
  const [editPassInput, setEditPassInput] = useState<string>(password.decryptedPassword);
  const [nickNameInput,setNickNameInput] = useState<string>(password.nickName);
  const [siteUrlInput,setSiteUrlInput] = useState<string>(password.siteUrl);
  const [userNameInput,setUserNameInput] = useState<string>(password.userName);
  const [isUserEditing,setIsUserEditing] = useState<boolean>(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState<boolean>(false);
  const handleDeletePassword = async function(){
    await vault.deletePassword(password._id);
    //refresh client passwords data
    setPasswords(await vault.populatePasswords());
  };
  const handleApplyPassChange = async function(){
    //set updated password inputs in vault
    vault.nickNameInput = nickNameInput;
    vault.siteUrlInput = siteUrlInput;
    vault.userNameInput = userNameInput;
    vault.passwordInput = editPassInput;
    //call update password method on vault
    setPasswords(await vault.updatePassword(password._id));
    setIsUserEditing(false);
  };
  //check if the user is currently editing this password or not
  if (!isPasswordExpanded){
    return(
      <p onClick={()=>{setIsPasswordExpanded(true)}}>{password.nickName}</p>
    )
  }
  if (!isUserEditing){
    return(
      <div className='password'>
        <p onClick={()=>{setIsPasswordExpanded(false)}}>{password.nickName}</p>
        <p><a href={`${password.siteUrl}`}>{password.siteUrl}</a></p>
        <p>Username: {password.userName}</p>
        {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
        <p>Password: {password.decryptedPassword}</p>
        <button type='button' onClick={()=>{setIsUserEditing(true)}}>Edit</button>
        <button type='button' onClick={()=>{handleDeletePassword()}}>Delete</button>
      </div>
    )
  }else{
    return(
      <form>
        <div>
          <p>Nickname</p>
          <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
        </div>
        <div>
          <p>Website Url</p>
          <input value={password.siteUrl} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
        </div>
        <div>
          <p>Username</p>
          <input value={password.userName} onChange={(e)=>{setUserNameInput(e.target.value)}} />
        </div>
        <div>
          <p>Password</p>
          <input value={editPassInput} onChange={(e)=>{setEditPassInput(e.target.value)}} />
        </div>
        <div>
          <button type='button' onClick={()=>{handleApplyPassChange()}}>Apply Changes</button>
          <button type='button' onClick={()=>{setIsUserEditing(false)}}>Cancel</button>
        </div>
        <PasswordGenerator setPasswordInput={setEditPassInput} />
      </form>
    )
  }
}