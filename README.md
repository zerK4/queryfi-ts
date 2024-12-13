---
title: Installation
---

Installation steps for `queryfi`.

This documentation showcase how to install the `queryfi` packages and make use of them in you applications.

---

This package is dedicated specially for `Laravel` applications as the server package is build for it.

However, if you have a backend which can communicate with queries the frontend package can also be used.

---

<Stepper>
  <StepperItem title="Install queryfi package">
  <Tabs defaultValue="client" className="pt-5 pb-1">
  <TabsList>
    <TabsTrigger value="client">Frontend</TabsTrigger>
    <TabsTrigger value="server">Server</TabsTrigger>
  </TabsList>
  <TabsContent value="client">
  Go ahead and open your frontend typescript app and run the following.

    <CodeBlock language="bash" title="Bash" >
      {
          `npm install package-name`
      }
    </CodeBlock>

  </TabsContent>
  <TabsContent value="server">
  Then open your backend and run this.

```bash 
npm install package-name
```
  </TabsContent>
</Tabs>
    
  </StepperItem>
  <StepperItem title="Configuration">
  Assuming you have your model whith which you want to work, we'll go with a simple approach, with direct controller 🤔, not the best approach, but fastest and easiest.

  If you want to check a better approach and a better DX overall, read <a className="text-orange-500" href="/blog">this</a>

<CodeBlock language="php" title="UserController.php">
{
`<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Z3rka\HasRelations\HasRelations;

class UserController extends Controller
{
    # make use of this trait.
    use HasRelations;

    public function index(Request $request)
    {
      $model = User::getModel();
      return $this->processModel($request, $model)->get();
    }
}
`
}
</CodeBlock>
  </StepperItem>
  <StepperItem title="Make use of it">
    In your frontend, whatever it is, use the frontend package you installed.
  <CodeBlock language="typescript" title="getUsers.ts">
  {
  `import {createQuery} from 'package-name'

    const query = createQuery<User>("/api/users")
      .with(["posts"])
      .where([
        ["name", "like", "%Marisa%"],
        ["id", ">", 10],
      ])
      .build();

    const { data } = await axios.get(query)

    //response example
    //     {
    //     "id": 50,
    //     "name": "Marques Kautzer",
    //     "email": "garrett.kiehn@example.com",
    //     "email_verified_at": "2024-12-10T16:16:18.000000Z",
    //     "created_at": "2024-12-10T16:16:18.000000Z",
    //     "updated_at": "2024-12-10T16:16:18.000000Z",
    //     "posts": [
    //         {
    //             "id": 99,
    //             "user_id": 50,
    //             "name": "Florida Kuhlman DDS",
    //             "status": "inactive",
    //             "content": "Eaque est qui natus ipsa hic. Nihil molestiae excepturi eos. Quos voluptatem modi voluptatem officiis voluptas. Magnam consequatur quod modi corporis.",
    //             "created_at": "2024-12-10T16:16:18.000000Z",
    //             "updated_at": "2024-12-10T16:16:18.000000Z"
    //         }
    //     ]
    // },
  `
  }
  </CodeBlock>
  </StepperItem>
</Stepper>


