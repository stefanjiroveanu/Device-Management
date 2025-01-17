toc.dat                                                                                             0000600 0004000 0002000 00000005565 14520500537 0014453 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       0            
    {            devices    16.0 (Debian 16.0-1.pgdg120+1)    16.0 (Debian 16.0-1.pgdg120+1)                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                    0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                    0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                    1262    16384    devices    DATABASE     r   CREATE DATABASE devices WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE devices;
                postgres    false         �            1259    16386    devices    TABLE     B  CREATE TABLE public.devices (
    id integer NOT NULL,
    uuid character varying NOT NULL,
    device_name character varying NOT NULL,
    device_address character varying NOT NULL,
    device_description character varying NOT NULL,
    max_energy_consumption integer NOT NULL,
    owner_id character varying NOT NULL
);
    DROP TABLE public.devices;
       public         heap    postgres    false         �            1259    16385    devices_id_seq    SEQUENCE     �   CREATE SEQUENCE public.devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.devices_id_seq;
       public          postgres    false    216                    0    0    devices_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;
          public          postgres    false    215         �           2604    16389 
   devices id    DEFAULT     h   ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);
 9   ALTER TABLE public.devices ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216                   0    16386    devices 
   TABLE DATA           ~   COPY public.devices (id, uuid, device_name, device_address, device_description, max_energy_consumption, owner_id) FROM stdin;
    public          postgres    false    216       3350.dat            0    0    devices_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.devices_id_seq', 18, true);
          public          postgres    false    215         �           2606    16393    devices devices_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.devices DROP CONSTRAINT devices_pkey;
       public            postgres    false    216                                                                                                                                                   3350.dat                                                                                            0000600 0004000 0002000 00000000451 14520500537 0014245 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        7	d0143862-e21c-4f99-9f90-7b6ac4815bf7	device5	bld dacia	bun bun rau	1231	998e9583-d57c-426e-a471-bba53f351bb5
5	77359bc3-447e-4b8d-9015-627218a69907	device2	ceahlau	bunrau	100	998e9583-d57c-426e-a471-bba53f351bb5
18	617a661d-4924-4856-8dea-f8b153ba268e	calculator	bld dacia	descriere	123	-1
\.


                                                                                                                                                                                                                       restore.sql                                                                                         0000600 0004000 0002000 00000006036 14520500537 0015372 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
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

DROP DATABASE devices;
--
-- Name: devices; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE devices WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE devices OWNER TO postgres;

\connect devices

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
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id integer NOT NULL,
    uuid character varying NOT NULL,
    device_name character varying NOT NULL,
    device_address character varying NOT NULL,
    device_description character varying NOT NULL,
    max_energy_consumption integer NOT NULL,
    owner_id character varying NOT NULL
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_id_seq OWNER TO postgres;

--
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (id, uuid, device_name, device_address, device_description, max_energy_consumption, owner_id) FROM stdin;
\.
COPY public.devices (id, uuid, device_name, device_address, device_description, max_energy_consumption, owner_id) FROM '$$PATH$$/3350.dat';

--
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devices_id_seq', 18, true);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  