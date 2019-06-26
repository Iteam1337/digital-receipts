<!-- ## Digital Ocean instructions

- Create a cluster with Containership
- Login to the master node and copy the kubernetes connection for `kubeadm` (usually in `/etc/kubernetes`)
-->

# POC demonstrating the flow of a digital receipt


### Getting started

- Clone the repo
- Install the dependencies

```bash
$ cd examples/poc
$ npm run install-all
```

### Run everything inside Docker

- You need to have Docker Compose [installed](https://docs.docker.com/compose/install/)

- Create a network for the project
```bash
$ docker network create digital-receipts
```

- Build Docker images and bring the stack up

```bash
$ cd examples/poc
$ docker-compose build
$ docker-compose up
```

- Run database migrations
```bash
$ cd examples/poc
$ npm run migrate
```


### Run only Databases inside Docker and run services locally

- You need to have Docker Compose [installed](https://docs.docker.com/compose/install/)

- Create a network for the project
```bash
$ docker network create digital-receipts
```

- Bring databases up
```bash
$ cd examples/poc
$ docker-compose -f docker-compose.dev.yaml up
```

- Run database migrations
```bash
$ cd examples/poc
$ npm run migrate
```

- Start services
```bash
$ cd examples/poc
$ npm run start:iframe
```

----

Now you can browse http://localhost:6900



