import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import morgan from 'morgan';
const app = express();
app.use(morgan("dev"));
const prisma = new PrismaClient();
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/house", async (req: Request, res: Response) => {
  try {
  
    const allHouses = await prisma.house.findMany({
        include:{
            owner: true,
            builtBy: true, 
        },
    })
    res.json(allHouses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
//! Create User
app.post("/", async(req:Request, res:Response) => {
    try {
        const newUser = await prisma.user.create({data: req.body})
        res.json(newUser)
    } catch (error) {
        res.status(500).json({error: "Error Posting data"})
    }
})
//! Create new hosue
app.post("/house", async(req:Request, res:Response) => {
    try {
        const newHouse = await prisma.house.create({data: req.body})
        res.json(newHouse)
    } catch (error) {
        res.status(500).json({error: "Error Posting data"})
    }
}) 
//! Update User Model
app.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id; //! This returns string 
    const newAge = req.body.age;
    if(id && newAge){
         const updatedUser = await prisma.user.update({
           where: { id },
           data: { age: newAge },
         });
             res.json(updatedUser);
    }else{
        res.status(404).json("Can't find ID or wrong var to update")
    }
   

  } catch (error) {
    res.status(500).json({ error: "Error Posting data" });
  }
});

app.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id; //! This returns string
    const deletedUser = await prisma.user.delete({
        where: {
            id
        }
    })
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Error Posting data" });
  }
});
//! query data with specific conditions
app.get("/house/withFilters", async (req, res) => {
  const filteredHouses = await prisma.house.count({
    where: {
      wifiPassword: {
        not: null,
      },
      owner: {
        age: {
          gte: 22,
        }
      },
    }, 
  })
  res.json(filteredHouses)
})
app.listen(3001, () => console.log(`Server running on port: ${3001}`));
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
