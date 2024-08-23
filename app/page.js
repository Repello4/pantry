'use client'
import Image from "next/image";
import {useState,useEffect} from "react"
import {db} from "./firebase"
import {Container, Box, Typography, List, ListItem, Button,Modal,TextField,Stack, Paper} from "@mui/material"
import {collection, query, getDocs, setDoc, doc, updateDoc, deleteDoc, getDoc, where} from "firebase/firestore"


export default function Home() {

  const [inventory, setInventory] = useState([])
  const [item, setItem] = useState("")



  const [qItem, setSearchItem] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)



  const [open, setOpen] = useState(false)

  const updateInventory = async () => {
    const inventoryList = []
    const snapshot = query(collection(db, "inventory"))
    const data = await getDocs(snapshot)
    data.docs.forEach((doc) => {
      inventoryList.push({...doc.data(), id: doc.id})
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }


  const removeItem = async (item) => {
    const docRef = doc(collection(db,'inventory'),item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await updateDoc(docRef, {quantity: quantity - 1})
      }

      await updateInventory()
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(db,'inventory'),item)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
        const {quantity} = docSnap.data()
        await updateDoc(docRef, {quantity: quantity + 1})
      } else {
        await setDoc(docRef, {quantity: 1})
      }

      await updateInventory()
    }

    const searchItem = async (item) => {
      console.log("Searching for:", item);
      // Query by document ID directly
      const foundItem = inventory.find(doc => doc.id === item);
      if (foundItem) {
        console.log("Found:", item);
        await setSearchItem(foundItem)
        handleSearchOpen()
      } else {
        alert("No item found");
      }
    }





  useEffect(() => {
    updateInventory()
  }, [])

  const handleSearchOpen = () => {
    setSearchOpen(true)
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const updateSearchItem = async (item) => {
    const foundItem = inventory.find(doc => doc.id === item);
    if (foundItem) {
      setSearchItem(foundItem)
    }
  }
  
  return(

    <Container>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Typography variant="h1" sx={{textAlign: "center"}}>Pantry Tracker</Typography>
        </Box>
          

        <TextField label="Search Item" value={item} onChange={(e) => setItem(e.target.value)} />
        <Button variant="contained" 
        onClick={() => {
          searchItem(item);
          }}
          >Search Item</Button>

          <Modal open={searchOpen} onClose={handleSearchClose}>
            <Box position="absolute" color="white" bgcolor="white" p={4} borderRadius={4} sx={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              <Typography variant="h2" sx ={{color: "black"}}>{qItem.id} Quantity: {qItem.quantity}</Typography>
              <Button variant="contained" onClick={handleSearchClose}>Close</Button>
              <Button variant="contained" onClick={async () => {
                await removeItem(qItem.id);
                updateInventory();
                const updatedItem = inventory.find(doc => doc.id === qItem.id);
                if (updatedItem) {
                  setSearchItem(updatedItem);
                } else {
                  handleSearchClose();
                }
              }}>Remove</Button>
            </Box>
          </Modal>





          <Button variant="contained" onClick={handleOpen}>Add Item</Button>
          <Modal open={open} onClose={handleClose}>
              <Box position="absolute" color="white" bgcolor="white" p={4} borderRadius={4} sx={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <Typography variant="h2" sx ={{color: "black"}}>Add Item</Typography>
              </Box>
            </Modal>




            <Modal open={open} onClose={handleClose}>
              <Box position="absolute" color="white" bgcolor="white" p={4} borderRadius={4} sx={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <Typography variant="h3" sx ={{color: "black"}}>Add Item</Typography>
                <Stack spacing={2}>
                  <TextField label="Item Name" value={item} onChange={(e) => setItem(e.target.value)} />
                  <Button variant="contained" 
                  onClick={() => {
                    addItem(item); 
                    setItem("");
                    handleClose();
                    }}>Add Item
                    </Button>
                  </Stack>
              </Box>
            </Modal>
          
          <Paper sx={{ flexDirection: "column", alignItems: "center", position: "absolute", top: "50%", left: "50%",
             transform: "translate(-50%, -50%)", width: "80%", maxHeight: '50vh', overflow: 'auto'}}>
            <Box sx={{ 
              overflowY: 'scroll', 
              maxHeight: '100%', 
              width: '100%',
              '&::-webkit-scrollbar': {
                width: '10px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '5px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}>
              <Stack spacing={1} sx={{ padding: 2 }}>
                {inventory.map((item) => ( 
                  <ListItem key={item.id} sx={{display: 'flex', padding: '8px 0'}}>
                    <Box sx={{border: '3px solid grey', display: 'flex', width: '100%', padding: '8px'}}>
                      <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant="h6">{item.id}</Typography>
                        <Typography variant="body1">Quantity: {item.quantity}</Typography>
                        <Button variant="contained" size="small" onClick={() => removeItem(item.id)}>Remove</Button>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </Stack>
            </Box>

          </Paper>
        
      </Container>
  )
}
