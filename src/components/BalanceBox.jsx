import {useState,useEffect} from'react'

const BalanceBox=({onBalanceChange})=>{

  // load balance from local storage 
  const[balance,setBalance]=useState(()=>{
    const stored=localStorage.getItem('availableBalance')
    return stored?parseFloat(stored):0
  })

  useEffect(()=>{
    localStorage.setItem('availableBalance',balance)
    if(onBalanceChange)onBalanceChange(balance)
  },[balance])

  return(
    <div className="balance-box">
      <label>Available Balance: $</label>
      <input
        type="number"
        value={balance}
        onChange={e=>setBalance(parseFloat(e.target.value)||0)}
      />
    </div>
  )
}

export default BalanceBox
