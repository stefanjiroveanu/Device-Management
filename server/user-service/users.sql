toc.dat                                                                                             0000600 0004000 0002000 00000005322 14520500437 0014441 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       /            
    {            appusers    16.0 (Debian 16.0-1.pgdg120+1)    16.0 (Debian 16.0-1.pgdg120+1)                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                    0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                    0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                    1262    16384    appusers    DATABASE     s   CREATE DATABASE appusers WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE appusers;
                postgres    false         �            1259    16386    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL,
    uuid character varying NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false         �            1259    16385    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216                    0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215         �           2604    16389    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216                   0    16386    users 
   TABLE DATA           J   COPY public.users (id, password, role, uuid, username, email) FROM stdin;
    public          postgres    false    216       3350.dat            0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 13, true);
          public          postgres    false    215         �           2606    16391    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216                                                                                                                                                                                                                                                                                                                      3350.dat                                                                                            0000600 0004000 0002000 00000001701 14520500437 0014243 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        5	$2b$10$LghOLJFzul6CDb/qPKXog./BcMZhVOo2qrgSO2uhjaO9poxpdcnXy	USER	998e9583-d57c-426e-a471-bba53f351bb5	user3	sjiroveanu3@gmail.com
6	$2b$10$Q2j8CSfPtU3A7eLkG6v4F.Cb2vVlWiw9cGbfhy87ftAvX/gNZUymW	USER	649ea623-d9ea-4994-9824-d126b57702cd	user4	sjiroveanu4@gmail.com
7	$2b$10$nE9u8t4BhqkH6b7LaLQmeO6i7js6g.e0fZ4bY0fMowDnlfUqkLxzi	USER	c1b57644-7e0d-454b-8674-d63fd62736b1	user5	sjiroveanu5@gmail.com
9	$2b$10$dVgL9jFTvDPwcCpgN/9ywu6J8ma7HjX3MYQmrgNzZWG7F9UdmWK02	USER	2e508c39-e594-42e0-afcb-217b074cf137	user7	sjiroveanu7@gmail.com
10	$2b$10$lzQU0L1hUakt.K9k9z34seTWyE0iNiAtgf6NuyxBJ92/jSCbbC2Qm	USER	711649ea-1ce8-4130-bb4a-952ccdee2c28	user9	user9@gmail.com
3	user123	USER	2316e88a-77ad-4646-9c13-a5d84ac2e88b	user1	sjiroveanu1@gmail.com
2	$2b$10$YCexDL/K/NIDoNvOh6m95uR396LQnL7RvDrDz8jip2SogqjdyRzOa	ADMIN	2f1f89ab-8883-4216-8bd9-0397da75ab46	admin	sjiroveanu23@gmail.com
13	admin123	ADMIN	6b152fbd-111f-4c8c-a21c-1129ba97b02b	andreiz	zandrei@gmail.com
\.


                                                               restore.sql                                                                                         0000600 0004000 0002000 00000005516 14520500437 0015373 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg120+1)
-- Dumped by pg_dump version 16.0 (Debian 16.0-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE appusers;
--
-- Name: appusers; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE appusers WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE appusers OWNER TO postgres;

\connect appusers

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL,
    uuid character varying NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, password, role, uuid, username, email) FROM stdin;
\.
COPY public.users (id, password, role, uuid, username, email) FROM '$$PATH$$/3350.dat';

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  